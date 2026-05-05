import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, User, CheckCircle2, Lock } from 'lucide-react';
import { db, auth, signInWithGoogle } from '../../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

export const RatingWidget = ({ rating, count }: { rating: number, count: number }) => (
  <div className="flex items-center gap-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
    <div className="text-center">
      <div className="text-4xl font-black text-gray-900 leading-none mb-1">{rating > 0 ? rating.toFixed(1) : '0.0'}</div>
      <div className="flex justify-center gap-0.5 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
        ))}
      </div>
      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{count} Reviews</div>
    </div>
    <div className="flex-1 space-y-1.5">
      {[5, 4, 3, 2, 1].map((s) => (
        <div key={s} className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-400 w-2">{s}</span>
          <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden">
             <div className="h-full bg-yellow-400 rounded-full" style={{ width: count > 0 ? `${(100 / count)}%` : '0%' }}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ReviewSection = ({ productId }: { productId?: string }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [userPendingReviews, setUserPendingReviews] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [reviewBody, setReviewBody] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!productId) return;
    
    // Approved reviews
    const q1 = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      where('status', '==', 'approved')
    );

    const unsub1 = onSnapshot(q1, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    });

    return () => unsub1();
  }, [productId]);

  useEffect(() => {
    if (!productId || !currentUser?.uid) {
       setUserPendingReviews([]);
       return;
    }
    
    // User's own pending reviews
    const q2 = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      where('userId', '==', currentUser.uid),
      where('status', '==', 'pending')
    );

    const unsub2 = onSnapshot(q2, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPendingReviews(data);
    });

    return () => unsub2();
  }, [productId, currentUser?.uid]);

  const handleSubmitReview = async () => {
    if (!currentUser) return;
    if (!productId) return;
    if (!reviewBody.trim()) return alert("Review body cannot be empty");

    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: currentUser.uid,
        rating: reviewRating,
        body: reviewBody,
        status: 'pending',    // Must be pending according to firestore rules
        createdAt: serverTimestamp()
      });
      setIsWriting(false);
      setReviewBody('');
      setReviewRating(5);
      alert("Review submitted! It will be visible to others after approval, but you can see it below.");
    } catch (e: any) {
      alert("Failed to submit review: " + e.message);
    }
  };

  const toggleLike = (reviewId: string) => {
    setLikedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const allVisibleReviews = [...reviews, ...userPendingReviews];
  const avgRating = allVisibleReviews.length > 0 
    ? allVisibleReviews.reduce((acc, rev) => acc + rev.rating, 0) / allVisibleReviews.length 
    : 0;

  return (
    <div id="reviews" className="space-y-12 max-w-4xl mx-auto py-20 border-t border-gray-100 mt-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">User Reviews</h2>
          <p className="text-gray-500 font-light">See what the community thinks about this product.</p>
        </div>
        <RatingWidget rating={avgRating} count={allVisibleReviews.length} />
      </div>

      <div className="space-y-8">
        {loading ? (
           <div className="animate-pulse flex flex-col gap-4">
             <div className="h-32 bg-gray-100 rounded-3xl"></div>
             <div className="h-32 bg-gray-100 rounded-3xl"></div>
           </div>
        ) : allVisibleReviews.length === 0 ? (
           <p className="text-gray-500 italic text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          allVisibleReviews.map((rev) => {
            const isLiked = likedReviews.has(rev.id);
            return (
              <div key={rev.id} className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                {rev.status === 'pending' && (
                  <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">Pending Approval</div>
                )}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <User size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">User • {rev.userId.substring(0, 5)}...</div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-black uppercase tracking-widest">
                        <CheckCircle2 size={10} /> Verified
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={16} className={s < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-8 font-light italic text-lg">"{rev.body}"</p>
                
                <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
                   <button 
                     onClick={() => toggleLike(rev.id)}
                     className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${isLiked ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
                   >
                     <ThumbsUp size={14} className={isLiked ? 'fill-indigo-600' : ''} /> Helpful ({isLiked ? 1 : 0})
                   </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {!isWriting ? (
        <div className="bg-indigo-600 rounded-[40px] p-12 text-center text-white shadow-2xl shadow-indigo-200 mt-12">
           <h3 className="text-2xl font-bold mb-4 italic">Have you tried this product?</h3>
           <p className="text-indigo-100 mb-8 max-w-lg mx-auto leading-relaxed">Your honest review helps thousands of other buyers choose the right gear for their journey.</p>
           {currentUser ? (
             <button onClick={() => setIsWriting(true)} className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 text-sm">
               Write a Review
             </button>
           ) : (
             <button onClick={async () => {
               try {
                 await signInWithGoogle();
               } catch (err) {
                 console.log("Sign in failed", err);
               }
             }} className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 text-sm flex items-center justify-center gap-2 mx-auto">
               <Lock size={16} /> Sign in to Review
             </button>
           )}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-indigo-100 p-10 shadow-lg mt-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Write your review</h3>
          <div className="mb-6 flex items-center gap-2">
             <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-4">Rating:</span>
             {Array.from({ length: 5 }).map((_, i) => (
               <button key={i} type="button" onClick={() => setReviewRating(i + 1)}>
                  <Star size={24} className={i < reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
               </button>
             ))}
          </div>
          <textarea 
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 min-h-[150px]"
            placeholder="What did you like or dislike about this product?"
            value={reviewBody}
            onChange={(e) => setReviewBody(e.target.value)}
          ></textarea>
          <div className="flex gap-4">
             <button onClick={handleSubmitReview} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-indigo-200 hover:bg-indigo-700 transition">Submit Review</button>
             <button onClick={() => setIsWriting(false)} className="bg-white text-gray-500 px-8 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

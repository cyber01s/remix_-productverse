export interface Product {
  id: string;
  name: string;
  brand: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  images: string[];
  thumbnail: string;
  availability: boolean;
  discountPercentage?: number;
  tags: string[];
  isTrending?: boolean;
  isEditorsPick?: boolean;
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  scores: {
    valueForMoney: number;
    performance: number;
    buildQuality: number;
    features: number;
    easeOfUse: number;
    support: number;
  };
  affiliateUrl: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  title: string;
  body: string;
  rating: number;
  criteria: {
    performance: number;
    design: number;
    value: number;
    durability: number;
    support: number;
  };
  helpfulVotes: number;
  isVerified: boolean;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface VsBattle {
  id: string;
  productIds: [string, string];
  slug: string;
  winnerProductId?: string;
  categories: {
    name: string;
    description: string;
    winnerProductId: string;
    analysis: string;
  }[];
  verdict: {
    title: string;
    body: string;
    chooseAIf: string[];
    chooseBIf: string[];
  };
  expertScore: number;
  communityScore: number;
  votes: Record<string, number>;
}

export interface BestList {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  products: {
    productId: string;
    rank: number;
    whyWePickedIt: string;
    bestFor: string;
  }[];
  lastUpdated: string;
  isFeatured: boolean;
}

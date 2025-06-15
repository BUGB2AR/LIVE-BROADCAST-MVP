export enum ViewerTier {
    Free = 'free',
    Bronze = 'bronze',
    Silver = 'silver',
    Gold = 'gold',
  }
  
  export class UserProfile {
    public avatarUrl?: string;
    public bio?: string;
    public viewerTier: ViewerTier;
  
    constructor(avatarUrl?: string, bio?: string, viewerTier: ViewerTier = ViewerTier.Free) {
      this.avatarUrl = avatarUrl;
      this.bio = bio;
      this.viewerTier = viewerTier;
    }
  
  }
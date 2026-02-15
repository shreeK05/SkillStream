import { Asset, LearningPathItem, UserProgress, User } from '../types';
import { MOCK_ASSETS } from '../data/mockData';

export class AdaptiveEngine {
  
  // Simulates: IF QuizScore < 60% -> Insert Remedial
  // Simulates: IF QuizScore > 90% -> Skip Intermediate
  static evaluatePerformance(
    currentPath: LearningPathItem[],
    currentItemId: string,
    progress: UserProgress,
    user: User
  ): { newPath: LearningPathItem[], message: string, type: 'neutral' | 'positive' | 'negative' } {

    const currentIndex = currentPath.findIndex(item => item.id === currentItemId);
    if (currentIndex === -1) return { newPath: currentPath, message: "Error updating path", type: 'neutral' };

    let updatedPath = [...currentPath];
    // Mark current as completed or failed based on logic, not just input
    updatedPath[currentIndex] = {
      ...updatedPath[currentIndex],
      status: 'Completed' // We mark completed, but score determines next steps
    };

    const currentAsset = MOCK_ASSETS.find(a => a.id === updatedPath[currentIndex].assetId);
    if (!currentAsset) return { newPath: currentPath, message: "Asset not found", type: 'neutral' };

    // LOGIC 1: REMEDIAL (Weak Concept)
    if ((progress.quizScore || 0) < 60) {
      // Find a remedial asset: Lower difficulty, same tag
      const remedialAsset = MOCK_ASSETS.find(a => 
        a.difficulty === 'Beginner' && 
        a.id !== currentAsset.id &&
        a.tags.some(t => currentAsset.tags.includes(t)) &&
        !currentPath.some(p => p.assetId === a.id) // Avoid duplicates
      );

      if (remedialAsset) {
        const newItem: LearningPathItem = {
          id: `remedial-${Date.now()}`,
          assetId: remedialAsset.id,
          status: 'Pending',
          isRemedial: true
        };
        // Insert immediately after current
        updatedPath.splice(currentIndex + 1, 0, newItem);
        
        return { 
          newPath: updatedPath, 
          message: `Adaptive Engine: We noticed you struggled with ${currentAsset.title}. We've added "${remedialAsset.title}" to reinforce the concepts.`,
          type: 'negative'
        };
      }
    }

    // LOGIC 2: FAST TRACK (Excellence)
    if ((progress.quizScore || 0) > 90) {
      // Check if next item is Intermediate
      const nextItemIndex = currentIndex + 1;
      if (nextItemIndex < updatedPath.length) {
        const nextPathItem = updatedPath[nextItemIndex];
        const nextAsset = MOCK_ASSETS.find(a => a.id === nextPathItem.assetId);

        if (nextAsset && nextAsset.difficulty === 'Intermediate') {
           // Skip it
           updatedPath.splice(nextItemIndex, 1);
           return {
             newPath: updatedPath,
             message: `Adaptive Engine: Outstanding performance! You've demonstrated mastery. We're skipping "${nextAsset.title}" to accelerate your growth.`,
             type: 'positive'
           };
        }
      }
    }
    
    // Unlock next item if it exists
    if (currentIndex + 1 < updatedPath.length) {
        // Just ensures the next one is pending, not locked (if we had locked logic)
    }

    return { 
      newPath: updatedPath, 
      message: "Module completed. Moving to next step in your path.", 
      type: 'neutral' 
    };
  }

  // Simulates: IF UserPreference == 'Visual': Prioritize Video
  static reorderForPreference(path: LearningPathItem[], preference: string): LearningPathItem[] {
    // Basic sorting logic: Prioritize assets that match the user's preference
    // Visual -> Video
    // Text -> Doc
    
    // We clone the path to avoid mutating the original array directly
    const sortedPath = [...path];
    
    return sortedPath.sort((a, b) => {
      // Find the assets for these items
      const assetA = MOCK_ASSETS.find(asset => asset.id === a.assetId);
      const assetB = MOCK_ASSETS.find(asset => asset.id === b.assetId);
      
      if (!assetA || !assetB) return 0;
      
      // Determine if they match the preference
      const isAPreferred = (preference === 'Visual' && assetA.type === 'Video') || 
                           (preference === 'Text' && assetA.type === 'Doc');
                           
      const isBPreferred = (preference === 'Visual' && assetB.type === 'Video') || 
                           (preference === 'Text' && assetB.type === 'Doc');
      
      // If A is preferred and B is not, A comes first
      if (isAPreferred && !isBPreferred) return -1;
      // If B is preferred and A is not, B comes first
      if (!isAPreferred && isBPreferred) return 1;
      
      // Otherwise keep original order
      return 0;
    });
  }
}
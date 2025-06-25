import { Fruit, FruitCategory, FruitType } from '../types/fruits';

export const fruitData: Record<FruitCategory, Fruit> = {
  abricots: {
    name: 'Abricots',
    hasSubCategories: false,
    varieties: {
      'colorado': {
        name: 'Colorado',
        image: 'https://images.unsplash.com/photo-1595411425732-e46469c14b8c?auto=format&fit=crop&q=80',
        description: 'Variété précoce à la chair ferme et sucrée.',
        technicalSheet: '/fiches-techniques/abricots-colorado.pdf',
        videoUrl: '',
        videoSource: {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      'bergeron': {
        name: 'Bergeron',
        image: 'https://images.unsplash.com/photo-1595411425732-e46469c14b8c?auto=format&fit=crop&q=80',
        description: 'Variété de saison, très parfumée, idéale pour la confiture.',
        technicalSheet: '/fiches-techniques/abricots-bergeron.pdf',
        videoUrl: '',
        videoSource: {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      'orangered': {
        name: 'Orangered',
        image: 'https://images.unsplash.com/photo-1595411425732-e46469c14b8c?auto=format&fit=crop&q=80',
        description: 'Variété tardive à la chair juteuse et aromatique.',
        technicalSheet: '/fiches-techniques/abricots-orangered.pdf',
        videoUrl: '',
        videoSource: {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      'early-blush': {
        name: 'Early Blush',
        image: 'https://images.unsplash.com/photo-1595411425732-e46469c14b8c?auto=format&fit=crop&q=80',
        description: 'Variété très précoce à la chair tendre et sucrée.',
        technicalSheet: '/fiches-techniques/abricots-early-blush.pdf',
        videoUrl: '',
        videoSource: {
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      }
    }
  },
  peches: {
    name: 'Pêches',
    hasSubCategories: true,
    varieties: {
      jaune: {
        'spring-lady': {
          name: 'Spring Lady',
          image: 'https://images.unsplash.com/photo-1639588473831-dd9d014646ae?auto=format&fit=crop&q=80',
          description: 'Pêche jaune précoce à la chair fondante.',
          technicalSheet: '/fiches-techniques/peches-spring-lady.pdf',
          videoUrl: '',
          videoSource: {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        },
        'royal-glory': {
          name: 'Royal Glory',
          image: 'https://images.unsplash.com/photo-1639588473831-dd9d014646ae?auto=format&fit=crop&q=80',
          description: 'Pêche jaune de saison à la chair ferme.',
          technicalSheet: '/fiches-techniques/peches-royal-glory.pdf',
          videoUrl: '',
          videoSource: {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        }
      },
      blanche: {
        'white-lady': {
          name: 'White Lady',
          image: 'https://images.unsplash.com/photo-1639588473831-dd9d014646ae?auto=format&fit=crop&q=80',
          description: 'Pêche blanche sucrée et parfumée.',
          technicalSheet: '/fiches-techniques/peches-white-lady.pdf',
          videoUrl: '',
          videoSource: {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        }
      },
      sanguine: {
        'crimson-lady': {
          name: 'Crimson Lady',
          image: 'https://images.unsplash.com/photo-1639588473831-dd9d014646ae?auto=format&fit=crop&q=80',
          description: 'Pêche sanguine à la chair rouge intense.',
          technicalSheet: '/fiches-techniques/peches-crimson-lady.pdf',
          videoUrl: '',
          videoSource: {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        }
      },
      plate: {
        'plate-douce': {
          name: 'Plate Douce',
          image: 'https://images.unsplash.com/photo-1639588473831-dd9d014646ae?auto=format&fit=crop&q=80',
          description: 'Pêche plate à la saveur douce et sucrée.',
          technicalSheet: '/fiches-techniques/peches-plate-douce.pdf',
          videoUrl: '',
          videoSource: {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        }
      }
    }
  },
  nectarines: {
    name: 'Nectarines',
    hasSubCategories: true,
    varieties: {
      jaune: {
        'big-top': {
          name: 'Big Top',
          image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&q=80',
          description: 'Nectarine jaune à la chair ferme et sucrée.',
          technicalSheet: '/fiches-techniques/nectarines-big-top.pdf',
          videoUrl: '',
          videoSource: {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        }
      },
      blanche: {
        'snow-queen': {
          name: 'Snow Queen',
          image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&q=80',
          description: 'Nectarine blanche à la chair fondante.',
          technicalSheet: '/fiches-techniques/nectarines-snow-queen.pdf',
          videoUrl: '',
          videoSource: {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        }
      },
      sanguine: {
        'ruby-diamond': {
          name: 'Ruby Diamond',
          image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&q=80',
          description: 'Nectarine sanguine au goût intense.',
          technicalSheet: '/fiches-techniques/nectarines-ruby-diamond.pdf',
          videoUrl: '',
          videoSource: {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        }
      },
      plate: {
        'platinette': {
          name: 'Platinette',
          image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&q=80',
          description: 'Nectarine plate au parfum délicat.',
          technicalSheet: '/fiches-techniques/nectarines-platinette.pdf',
          videoUrl: '',
          videoSource: {
            type: 'youtube',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        }
      }
    }
  }
};
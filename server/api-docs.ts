/**
 * API Documentation Generator
 * Provides comprehensive documentation for all SkateHubba API endpoints
 */

/**
 * API endpoint documentation structure
 */
export interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  authentication?: string;
  parameters?: Array<{
    name: string;
    type: string;
    location: 'path' | 'query' | 'body' | 'header';
    required: boolean;
    description: string;
  }>;
  requestBody?: {
    type: string;
    example: any;
  };
  responses: Array<{
    status: number;
    description: string;
    example: any;
  }>;
  notes?: string[];
}

/**
 * API category grouping related endpoints
 */
export interface APICategory {
  name: string;
  description: string;
  endpoints: APIEndpoint[];
}

/**
 * Complete API documentation structure
 * Organized by functional categories with detailed endpoint information
 */
export const apiDocumentation: APICategory[] = [
  {
    name: 'Health & Status',
    description: 'System health and status endpoints',
    endpoints: [
      {
        method: 'GET',
        path: '/api/health',
        description: 'Check API health status',
        responses: [
          {
            status: 200,
            description: 'API is healthy',
            example: {
              status: 'ok',
              env: 'development',
              time: '2025-11-03T07:00:00.000Z'
            }
          }
        ]
      }
    ]
  },
  {
    name: 'Authentication',
    description: 'Firebase-based authentication endpoints',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Login or register with Firebase ID token',
        authentication: 'Firebase ID Token (Bearer)',
        parameters: [
          {
            name: 'Authorization',
            type: 'string',
            location: 'header',
            required: true,
            description: 'Bearer token with Firebase ID token'
          }
        ],
        requestBody: {
          type: 'application/json',
          example: {
            firstName: 'John',
            lastName: 'Doe',
            isRegistration: true
          }
        },
        responses: [
          {
            status: 200,
            description: 'Login successful, session cookie set',
            example: {
              user: {
                id: 'user_123',
                email: 'user@example.com',
                displayName: 'John Doe',
                photoUrl: 'https://example.com/photo.jpg',
                roles: [],
                createdAt: '2025-11-03T07:00:00.000Z',
                provider: 'firebase'
              },
              strategy: 'firebase'
            }
          },
          {
            status: 401,
            description: 'Invalid Firebase token',
            example: { error: 'Invalid Firebase token' }
          }
        ],
        notes: [
          'Rate limited to prevent brute force attacks',
          'Creates HttpOnly session cookie for subsequent requests',
          'Auto-creates user record if first login'
        ]
      },
      {
        method: 'GET',
        path: '/api/auth/me',
        description: 'Get current authenticated user information',
        authentication: 'Session Cookie or Bearer Token',
        responses: [
          {
            status: 200,
            description: 'User information retrieved',
            example: {
              user: {
                id: 'user_123',
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                isEmailVerified: true,
                lastLoginAt: '2025-11-03T07:00:00.000Z',
                createdAt: '2025-11-03T06:00:00.000Z'
              }
            }
          },
          {
            status: 401,
            description: 'Not authenticated',
            example: { error: 'Authentication required' }
          }
        ]
      },
      {
        method: 'POST',
        path: '/api/auth/logout',
        description: 'Logout and clear session',
        authentication: 'Session Cookie or Bearer Token',
        responses: [
          {
            status: 200,
            description: 'Logout successful',
            example: {
              success: true,
              message: 'Logged out successfully'
            }
          }
        ],
        notes: ['Clears HttpOnly session cookie', 'Deletes session from database']
      }
    ]
  },
  {
    name: 'Tutorial Steps',
    description: 'Onboarding tutorial step management',
    endpoints: [
      {
        method: 'GET',
        path: '/api/tutorial/steps',
        description: 'Get all tutorial steps',
        responses: [
          {
            status: 200,
            description: 'List of tutorial steps',
            example: [
              {
                id: 1,
                title: 'Welcome',
                description: 'Welcome to SkateHubba',
                order: 1
              }
            ]
          }
        ]
      },
      {
        method: 'GET',
        path: '/api/tutorial/steps/:id',
        description: 'Get a specific tutorial step by ID',
        parameters: [
          {
            name: 'id',
            type: 'integer',
            location: 'path',
            required: true,
            description: 'Tutorial step ID'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Tutorial step details',
            example: {
              id: 1,
              title: 'Welcome',
              description: 'Welcome to SkateHubba',
              order: 1
            }
          },
          {
            status: 404,
            description: 'Tutorial step not found',
            example: { error: 'Tutorial step not found' }
          }
        ]
      }
    ]
  },
  {
    name: 'User Progress',
    description: 'User tutorial and onboarding progress tracking',
    endpoints: [
      {
        method: 'GET',
        path: '/api/users/:userId/progress',
        description: 'Get all progress records for a user',
        parameters: [
          {
            name: 'userId',
            type: 'string',
            location: 'path',
            required: true,
            description: 'User ID'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'List of user progress records',
            example: [
              {
                userId: 'user_123',
                stepId: 1,
                completed: true,
                completedAt: '2025-11-03T07:00:00.000Z'
              }
            ]
          }
        ]
      },
      {
        method: 'GET',
        path: '/api/users/:userId/progress/:stepId',
        description: 'Get progress for a specific step',
        parameters: [
          {
            name: 'userId',
            type: 'string',
            location: 'path',
            required: true,
            description: 'User ID'
          },
          {
            name: 'stepId',
            type: 'integer',
            location: 'path',
            required: true,
            description: 'Tutorial step ID'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Progress details for the step',
            example: {
              userId: 'user_123',
              stepId: 1,
              completed: true,
              completedAt: '2025-11-03T07:00:00.000Z'
            }
          },
          {
            status: 404,
            description: 'Progress not found',
            example: { error: 'Progress not found' }
          }
        ]
      },
      {
        method: 'POST',
        path: '/api/users/:userId/progress',
        description: 'Create a new progress record',
        parameters: [
          {
            name: 'userId',
            type: 'string',
            location: 'path',
            required: true,
            description: 'User ID'
          }
        ],
        requestBody: {
          type: 'application/json',
          example: {
            stepId: 1,
            completed: false
          }
        },
        responses: [
          {
            status: 201,
            description: 'Progress record created',
            example: {
              userId: 'user_123',
              stepId: 1,
              completed: false,
              createdAt: '2025-11-03T07:00:00.000Z'
            }
          },
          {
            status: 400,
            description: 'Invalid progress data',
            example: { error: 'Invalid progress data' }
          }
        ]
      },
      {
        method: 'PATCH',
        path: '/api/users/:userId/progress/:stepId',
        description: 'Update progress for a step',
        parameters: [
          {
            name: 'userId',
            type: 'string',
            location: 'path',
            required: true,
            description: 'User ID'
          },
          {
            name: 'stepId',
            type: 'integer',
            location: 'path',
            required: true,
            description: 'Tutorial step ID'
          }
        ],
        requestBody: {
          type: 'application/json',
          example: {
            completed: true
          }
        },
        responses: [
          {
            status: 200,
            description: 'Progress updated',
            example: {
              userId: 'user_123',
              stepId: 1,
              completed: true,
              completedAt: '2025-11-03T07:00:00.000Z'
            }
          }
        ]
      }
    ]
  },
  {
    name: 'Users',
    description: 'User profile and onboarding management',
    endpoints: [
      {
        method: 'GET',
        path: '/api/users/:id',
        description: 'Get user profile by ID',
        parameters: [
          {
            name: 'id',
            type: 'string',
            location: 'path',
            required: true,
            description: 'User ID'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'User profile',
            example: {
              id: 'user_123',
              email: 'user@example.com',
              firstName: 'John',
              lastName: 'Doe',
              onboardingCompleted: false,
              onboardingStep: 1
            }
          },
          {
            status: 404,
            description: 'User not found',
            example: { error: 'User not found' }
          }
        ]
      },
      {
        method: 'PATCH',
        path: '/api/users/:id/onboarding',
        description: 'Update user onboarding status',
        parameters: [
          {
            name: 'id',
            type: 'string',
            location: 'path',
            required: true,
            description: 'User ID'
          }
        ],
        requestBody: {
          type: 'application/json',
          example: {
            completed: true,
            currentStep: 5
          }
        },
        responses: [
          {
            status: 200,
            description: 'Onboarding status updated',
            example: {
              id: 'user_123',
              onboardingCompleted: true,
              onboardingStep: 5
            }
          }
        ]
      },
      {
        method: 'POST',
        path: '/api/demo-user',
        description: 'Create a demo user for testing',
        responses: [
          {
            status: 201,
            description: 'Demo user created',
            example: {
              id: 'demo_skater_1730620800000',
              firstName: 'Demo',
              lastName: 'User'
            }
          }
        ],
        notes: ['For development and testing purposes only']
      }
    ]
  },
  {
    name: 'Spots',
    description: 'Skate spot discovery and check-in',
    endpoints: [
      {
        method: 'GET',
        path: '/api/spots',
        description: 'Get all skate spots',
        responses: [
          {
            status: 200,
            description: 'List of all spots',
            example: [
              {
                spotId: 'spot_001',
                name: 'Love Park',
                lat: 39.9526,
                lng: -75.1652,
                description: 'Legendary Philadelphia skate spot'
              }
            ]
          }
        ]
      },
      {
        method: 'GET',
        path: '/api/spots/:spotId',
        description: 'Get specific spot details',
        parameters: [
          {
            name: 'spotId',
            type: 'string',
            location: 'path',
            required: true,
            description: 'Spot ID'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Spot details',
            example: {
              spotId: 'spot_001',
              name: 'Love Park',
              lat: 39.9526,
              lng: -75.1652,
              description: 'Legendary Philadelphia skate spot'
            }
          },
          {
            status: 404,
            description: 'Spot not found',
            example: { error: 'Spot not found' }
          }
        ]
      },
      {
        method: 'POST',
        path: '/api/spots/check-in',
        description: 'Check in at a spot with geo-verification',
        requestBody: {
          type: 'application/json',
          example: {
            spotId: 'spot_001',
            userId: 'user_123',
            latitude: 39.9526,
            longitude: -75.1652
          }
        },
        responses: [
          {
            status: 200,
            description: 'Check-in successful',
            example: {
              success: true,
              message: 'Successfully checked in at Love Park!',
              access: {
                spotId: 'spot_001',
                accessGrantedAt: 1730620800000,
                expiresAt: 1730707200000,
                trickId: 'trick_spot_001_1730620800000',
                hologramUrl: '/tricks/holograms/spot_001.glb'
              },
              distance: 15
            }
          },
          {
            status: 403,
            description: 'Too far from spot',
            example: {
              success: false,
              message: 'You must be within 30m of Love Park to check in. You are 150m away.',
              distance: 150
            }
          }
        ],
        notes: [
          'Uses Haversine formula to calculate distance',
          'Requires user to be within 30 meters of spot',
          'Grants 24-hour access to AR content'
        ]
      }
    ]
  },
  {
    name: 'Products',
    description: 'SkateHubba merchandise and shop',
    endpoints: [
      {
        method: 'GET',
        path: '/api/products',
        description: 'Get all products',
        responses: [
          {
            status: 200,
            description: 'List of all products',
            example: [
              {
                productId: 'prod_001',
                name: 'SkateHubba Tee',
                description: 'Official SkateHubba t-shirt',
                price: 2999,
                currency: 'usd'
              }
            ]
          }
        ]
      },
      {
        method: 'GET',
        path: '/api/products/:productId',
        description: 'Get specific product details',
        parameters: [
          {
            name: 'productId',
            type: 'string',
            location: 'path',
            required: true,
            description: 'Product ID'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Product details',
            example: {
              productId: 'prod_001',
              name: 'SkateHubba Tee',
              description: 'Official SkateHubba t-shirt',
              price: 2999,
              currency: 'usd'
            }
          },
          {
            status: 404,
            description: 'Product not found',
            example: { error: 'Product not found' }
          }
        ]
      }
    ]
  },
  {
    name: 'Payments',
    description: 'Stripe payment processing',
    endpoints: [
      {
        method: 'POST',
        path: '/api/create-payment-intent',
        description: 'Create payment intent for donations',
        requestBody: {
          type: 'application/json',
          example: {
            amount: 25.00,
            currency: 'usd',
            description: 'SkateHubba Donation'
          }
        },
        responses: [
          {
            status: 200,
            description: 'Payment intent created',
            example: {
              clientSecret: 'pi_xxx_secret_xxx',
              paymentIntentId: 'pi_xxx'
            }
          },
          {
            status: 400,
            description: 'Invalid amount',
            example: { error: 'Amount must be between $0.50 and $10,000' }
          }
        ],
        notes: [
          'Amount must be between $0.50 and $10,000',
          'Supports card, Apple Pay, Google Pay, and Link'
        ]
      },
      {
        method: 'GET',
        path: '/api/payment-intent/:id',
        description: 'Get payment intent status',
        parameters: [
          {
            name: 'id',
            type: 'string',
            location: 'path',
            required: true,
            description: 'Payment Intent ID'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Payment intent status',
            example: {
              status: 'succeeded',
              amount: 25.00,
              currency: 'usd',
              description: 'SkateHubba Donation'
            }
          }
        ]
      },
      {
        method: 'POST',
        path: '/api/create-shop-payment-intent',
        description: 'Create payment intent for shop purchases',
        requestBody: {
          type: 'application/json',
          example: {
            items: [
              { id: 'prod_001', quantity: 2 },
              { id: 'prod_002', quantity: 1 }
            ],
            userId: 'user_123',
            userEmail: 'user@example.com'
          }
        },
        responses: [
          {
            status: 200,
            description: 'Payment intent created',
            example: {
              clientSecret: 'pi_xxx_secret_xxx'
            }
          },
          {
            status: 400,
            description: 'Invalid items',
            example: { message: 'Invalid cart items' }
          }
        ],
        notes: [
          'Server validates prices from database',
          'Prevents price manipulation by client',
          'Creates order record in database'
        ]
      },
      {
        method: 'POST',
        path: '/api/record-donation',
        description: 'Record successful donation',
        requestBody: {
          type: 'application/json',
          example: {
            paymentIntentId: 'pi_xxx',
            firstName: 'John'
          }
        },
        responses: [
          {
            status: 200,
            description: 'Donation recorded',
            example: {
              message: 'Donation recorded successfully',
              donationId: 1
            }
          }
        ]
      },
      {
        method: 'GET',
        path: '/api/recent-donors',
        description: 'Get recent donors (first names only)',
        parameters: [
          {
            name: 'limit',
            type: 'integer',
            location: 'query',
            required: false,
            description: 'Number of donors to return (max 50, default 10)'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'List of recent donors',
            example: [
              {
                firstName: 'John',
                createdAt: '2025-11-03T07:00:00.000Z'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Subscribers',
    description: 'Beta subscriber management',
    endpoints: [
      {
        method: 'POST',
        path: '/api/subscribe',
        description: 'Subscribe to beta list',
        requestBody: {
          type: 'application/json',
          example: {
            email: 'user@example.com',
            firstName: 'John'
          }
        },
        responses: [
          {
            status: 201,
            description: 'Subscription created',
            example: {
              ok: true,
              status: 'created',
              id: 1,
              msg: 'Welcome to the beta list! Check your email for confirmation.'
            }
          },
          {
            status: 200,
            description: 'Already subscribed',
            example: {
              ok: true,
              status: 'exists',
              msg: "You're already on the beta list! We'll notify you when it's ready."
            }
          }
        ],
        notes: ['Sends welcome email via Resend', 'Idempotent - safe to call multiple times']
      },
      {
        method: 'GET',
        path: '/api/subscribers',
        description: 'Get all subscribers (admin only)',
        authentication: 'API Key required',
        parameters: [
          {
            name: 'x-api-key',
            type: 'string',
            location: 'header',
            required: true,
            description: 'Admin API key'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'List of subscribers',
            example: [
              {
                id: 1,
                email: 'user@example.com',
                firstName: 'John',
                isActive: true,
                createdAt: '2025-11-03T07:00:00.000Z'
              }
            ]
          },
          {
            status: 401,
            description: 'Unauthorized',
            example: { error: 'Invalid or missing API key' }
          }
        ]
      }
    ]
  },
  {
    name: 'AI Chat',
    description: 'AI-powered skateboarding assistant',
    endpoints: [
      {
        method: 'POST',
        path: '/api/ai/chat',
        description: 'Chat with Hesher, the AI skate buddy',
        requestBody: {
          type: 'application/json',
          example: {
            messages: [
              { role: 'user', content: 'How do I kickflip?' }
            ]
          }
        },
        responses: [
          {
            status: 200,
            description: 'AI response',
            example: {
              ok: true,
              reply: {
                role: 'assistant',
                content: 'Kickflips are all about the flick! Start with your back foot on the tail...'
              }
            }
          },
          {
            status: 503,
            description: 'AI service unavailable',
            example: {
              ok: false,
              error: 'AI chat is currently unavailable'
            }
          }
        ],
        notes: [
          'Powered by OpenAI GPT-4o-mini',
          'Maintains last 12 messages for context',
          'Responses limited to 150 words'
        ]
      },
      {
        method: 'POST',
        path: '/api/assistant',
        description: 'Legacy AI assistant (deprecated)',
        requestBody: {
          type: 'application/json',
          example: {
            persona: 'filmer',
            messages: [
              { role: 'user', content: 'How do I film a line?' }
            ]
          }
        },
        responses: [
          {
            status: 200,
            description: 'AI response',
            example: {
              ok: true,
              reply: {
                role: 'assistant',
                content: 'Yo! Keep that camera steady and follow through...'
              }
            }
          }
        ],
        notes: ['Deprecated - use /api/ai/chat instead', 'Supports "filmer" and "editor" personas']
      }
    ]
  },
  {
    name: 'S.K.A.T.E. Game',
    description: 'Remote S.K.A.T.E. game functionality',
    endpoints: [
      {
        method: 'GET',
        path: '/api/games',
        description: 'Get all games for a user',
        parameters: [
          {
            name: 'userId',
            type: 'string',
            location: 'query',
            required: true,
            description: 'User ID'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'List of games',
            example: [
              {
                gameId: 'game_001',
                player1Id: 'user_123',
                player1Name: 'John',
                player2Id: 'user_456',
                player2Name: 'Jane',
                status: 'active',
                currentTurn: 'user_123',
                player1Letters: 'SK',
                player2Letters: 'S'
              }
            ]
          }
        ]
      },
      {
        method: 'POST',
        path: '/api/games/create',
        description: 'Create a new game',
        requestBody: {
          type: 'application/json',
          example: {
            userId: 'user_123'
          }
        },
        responses: [
          {
            status: 201,
            description: 'Game created',
            example: {
              gameId: 'game_001',
              player1Id: 'user_123',
              player1Name: 'John',
              status: 'waiting'
            }
          }
        ]
      },
      {
        method: 'POST',
        path: '/api/games/:gameId/join',
        description: 'Join an existing game',
        parameters: [
          {
            name: 'gameId',
            type: 'string',
            location: 'path',
            required: true,
            description: 'Game ID'
          }
        ],
        requestBody: {
          type: 'application/json',
          example: {
            userId: 'user_456'
          }
        },
        responses: [
          {
            status: 200,
            description: 'Joined game',
            example: {
              gameId: 'game_001',
              player1Id: 'user_123',
              player2Id: 'user_456',
              status: 'active'
            }
          },
          {
            status: 400,
            description: 'Cannot join game',
            example: { error: 'Game is not available to join' }
          }
        ]
      },
      {
        method: 'POST',
        path: '/api/games/:gameId/trick',
        description: 'Submit a trick in a game',
        parameters: [
          {
            name: 'gameId',
            type: 'string',
            location: 'path',
            required: true,
            description: 'Game ID'
          }
        ],
        requestBody: {
          type: 'application/json',
          example: {
            userId: 'user_123',
            trick: 'Kickflip'
          }
        },
        responses: [
          {
            status: 200,
            description: 'Trick submitted',
            example: {
              gameId: 'game_001',
              currentTurn: 'user_456',
              lastTrick: 'Kickflip'
            }
          },
          {
            status: 403,
            description: 'Not your turn',
            example: { error: "It's not your turn" }
          }
        ]
      },
      {
        method: 'GET',
        path: '/api/games/:gameId',
        description: 'Get game details including turn history',
        parameters: [
          {
            name: 'gameId',
            type: 'string',
            location: 'path',
            required: true,
            description: 'Game ID'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Game details with turn history',
            example: {
              gameId: 'game_001',
              player1Id: 'user_123',
              player2Id: 'user_456',
              status: 'active',
              turns: [
                {
                  turnId: 1,
                  gameId: 'game_001',
                  playerId: 'user_123',
                  trick: 'Kickflip',
                  createdAt: '2025-11-03T07:00:00.000Z'
                }
              ]
            }
          }
        ]
      }
    ]
  }
];

/**
 * Generate HTML documentation page
 */
export function generateHTMLDocs(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SkateHubba™ API Documentation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
      margin-bottom: 40px;
    }
    header h1 { font-size: 2.5em; margin-bottom: 10px; }
    header p { font-size: 1.2em; opacity: 0.9; }
    .category {
      background: white;
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .category h2 {
      color: #667eea;
      margin-bottom: 10px;
      font-size: 1.8em;
    }
    .category > p {
      color: #666;
      margin-bottom: 30px;
    }
    .endpoint {
      border-left: 4px solid #667eea;
      padding: 20px;
      margin-bottom: 30px;
      background: #f9f9f9;
      border-radius: 4px;
    }
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }
    .method {
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 0.9em;
      color: white;
    }
    .method.GET { background: #10b981; }
    .method.POST { background: #3b82f6; }
    .method.PATCH { background: #f59e0b; }
    .method.PUT { background: #8b5cf6; }
    .method.DELETE { background: #ef4444; }
    .path {
      font-family: 'Courier New', monospace;
      font-size: 1.1em;
      color: #333;
      font-weight: 600;
    }
    .auth-badge {
      background: #fbbf24;
      color: #78350f;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 600;
    }
    .description {
      color: #555;
      margin-bottom: 20px;
      font-size: 1.05em;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-weight: 600;
      color: #667eea;
      margin-bottom: 10px;
      font-size: 1.1em;
    }
    .parameter {
      background: white;
      padding: 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
    }
    .param-name {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: #667eea;
    }
    .param-type {
      font-family: 'Courier New', monospace;
      color: #666;
      font-size: 0.9em;
    }
    .param-required {
      background: #fee2e2;
      color: #991b1b;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.75em;
      font-weight: 600;
      margin-left: 8px;
    }
    .param-optional {
      background: #e0e7ff;
      color: #3730a3;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.75em;
      font-weight: 600;
      margin-left: 8px;
    }
    pre {
      background: #1f2937;
      color: #e5e7eb;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.9em;
    }
    code {
      font-family: 'Courier New', monospace;
    }
    .response {
      background: white;
      padding: 12px;
      margin-bottom: 12px;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
    }
    .status-code {
      font-weight: 600;
      margin-right: 10px;
    }
    .status-code.success { color: #10b981; }
    .status-code.error { color: #ef4444; }
    .status-code.redirect { color: #f59e0b; }
    .notes {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      border-radius: 4px;
      margin-top: 15px;
    }
    .notes ul {
      margin-left: 20px;
    }
    .notes li {
      margin-bottom: 5px;
    }
    footer {
      text-align: center;
      padding: 40px 20px;
      color: #666;
      border-top: 1px solid #e5e7eb;
      margin-top: 60px;
    }
    @media (max-width: 768px) {
      header h1 { font-size: 1.8em; }
      .endpoint-header { flex-direction: column; align-items: flex-start; }
    }
  </style>
</head>
<body>
  <header>
    <h1>🛹 SkateHubba™ API</h1>
    <p>Complete REST API Documentation</p>
  </header>

  <div class="container">
    ${apiDocumentation.map(category => `
      <div class="category">
        <h2>${category.name}</h2>
        <p>${category.description}</p>
        
        ${category.endpoints.map(endpoint => `
          <div class="endpoint">
            <div class="endpoint-header">
              <span class="method ${endpoint.method}">${endpoint.method}</span>
              <span class="path">${endpoint.path}</span>
              ${endpoint.authentication ? `<span class="auth-badge">🔒 ${endpoint.authentication}</span>` : ''}
            </div>
            
            <div class="description">${endpoint.description}</div>
            
            ${endpoint.parameters && endpoint.parameters.length > 0 ? `
              <div class="section">
                <div class="section-title">Parameters</div>
                ${endpoint.parameters.map(param => `
                  <div class="parameter">
                    <div>
                      <span class="param-name">${param.name}</span>
                      <span class="param-type">${param.type}</span>
                      <span class="${param.required ? 'param-required' : 'param-optional'}">
                        ${param.required ? 'REQUIRED' : 'OPTIONAL'}
                      </span>
                    </div>
                    <div style="margin-top: 5px; color: #666; font-size: 0.95em;">
                      ${param.description} <em>(${param.location})</em>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${endpoint.requestBody ? `
              <div class="section">
                <div class="section-title">Request Body</div>
                <pre><code>${JSON.stringify(endpoint.requestBody.example, null, 2)}</code></pre>
              </div>
            ` : ''}
            
            <div class="section">
              <div class="section-title">Responses</div>
              ${endpoint.responses.map(response => `
                <div class="response">
                  <div>
                    <span class="status-code ${response.status < 300 ? 'success' : 'error'}">
                      ${response.status}
                    </span>
                    <span>${response.description}</span>
                  </div>
                  ${response.example ? `
                    <pre style="margin-top: 10px;"><code>${JSON.stringify(response.example, null, 2)}</code></pre>
                  ` : ''}
                </div>
              `).join('')}
            </div>
            
            ${endpoint.notes && endpoint.notes.length > 0 ? `
              <div class="notes">
                <strong>📌 Notes:</strong>
                <ul>
                  ${endpoint.notes.map(note => `<li>${note}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `).join('')}
  </div>

  <footer>
    <p>SkateHubba™ API Documentation</p>
    <p>Built with ❤️ by Design Mainline LLC</p>
  </footer>
</body>
</html>
  `.trim();
}

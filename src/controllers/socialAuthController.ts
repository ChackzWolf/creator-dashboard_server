
import { Request, Response } from "express";
import { config } from "../configs/env.configs";
import { SocialPlatform } from "../types/socialPlatforms";
import { ISocialAccountService } from "../interfaces/IServices/ISocialMediaService";
import { ISocialAccount } from "../models/socialAccounts";

export class SocialAuthController {
    socialMediaService: ISocialAccountService;
    constructor(socialMediaService: ISocialAccountService){
        this.socialMediaService = socialMediaService
    }


    async getRedditAccessToken(req: Request, res: Response) {
        console.log('token reddit triggered', req.body);
        const { code, userId } = req.body;
        // Add request ID to track multiple simultaneous requests
        const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        console.log(`[${requestId}] Processing Reddit auth with code: ${code.substring(0, 5)}...`);

        // Prevent duplicate processing by checking if response is already sent
        let isResponseSent = false;

        // Log the credentials being used
        console.log(`[${requestId}] Using credentials:`, {
            codeLength: code.length,
            clientId: config.REDDIT_CLIENT_ID,
            secretLength: config.REDDIT_CLIENT_SECRET ? config.REDDIT_CLIENT_SECRET.length : 0,
            uri: config.REDDIT_REDIRECT_URI
        });

        try { 
            // Create the authorization string
            const authString = Buffer.from(`${config.REDDIT_CLIENT_ID}:${config.REDDIT_CLIENT_SECRET}`).toString('base64');
            let profileData = null;
            let platformUserId = null;
            let platformUsername = null;

            // Log the request details (without exposing full credentials)
            console.log(`[${requestId}] Making token request to Reddit with:`);
            console.log(`[${requestId}] - Auth header prefix: Basic ${authString.substring(0, 10)}...`);
            console.log(`[${requestId}] - Redirect URI: ${config.REDDIT_REDIRECT_URI}`);
            console.log(`[${requestId}] - Code length: ${code.length}`);

            // Make the token request
            const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'CreatorDashboard/1.0.0 by ChackzWolf'
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: config.REDDIT_REDIRECT_URI,
                }),
            });

            // Log the response status
            console.log(`[${requestId}] Reddit token response status:`, tokenResponse.status);
            
            const rawText = await tokenResponse.text();
            console.log(`[${requestId}] Reddit token raw response:`, rawText);

            let tokenData;
            try {
                tokenData = JSON.parse(rawText);
            } catch (error) {
                console.error(`[${requestId}] ❌ Reddit token exchange failed. Response was not JSON:`, rawText);
                if (!isResponseSent) {
                    isResponseSent = true;
                     res.status(500).json({ error: "Invalid response from Reddit (not JSON)" });
                     return
                }
                return;
            }

            if (!tokenData.access_token) {
                console.error(`[${requestId}] ❌ Reddit response did not include access_token:`, tokenData);
                
                // Check for specific error cases
                if (tokenData.error === 'invalid_grant') {
                    if (!isResponseSent) {
                        isResponseSent = true;
                         res.status(400).json({ 
                            error: "Invalid authorization code. It may be expired or already used.",
                            details: tokenData
                        });
                        return
                    }
                    return;
                }
                
                if (tokenData.error === 'unsupported_grant_type') {
                    if (!isResponseSent) {
                        isResponseSent = true;
                         res.status(400).json({ 
                            error: "Unsupported grant type. Check Reddit API documentation.",
                            details: tokenData
                        });
                        return
                    }
                    return;
                }
                
                if (tokenData.error === 'invalid_client') {
                    if (!isResponseSent) {
                        isResponseSent = true;
                         res.status(401).json({ 
                            error: "Invalid client credentials (ID or secret).",
                            details: tokenData
                        });
                        
                        return
                    }
                    return;
                }
                
                if (!isResponseSent) {
                    isResponseSent = true;
                     res.status(500).json({ 
                        error: "Reddit did not provide an access token", 
                        details: tokenData 
                    });
                    return
                }
                return;
            }

            console.log(`[${requestId}] ✅ Successfully obtained access token from Reddit`);
            
            // Fetch user profile with the access token
            try {
                const profileResponse = await fetch("https://oauth.reddit.com/api/v1/me", {
                    headers: {
                        'Authorization': `Bearer ${tokenData.access_token}`,
                        'User-Agent': "CreatorDashboard/1.0.0 by ChackzWolf",
                    },
                });
                
                console.log(`[${requestId}] Profile response status:`, profileResponse.status);
                const expiryDate = new Date(Date.now() + tokenData.expires_in * 1000);


                
                if (!profileResponse.ok) {
                    console.error(`[${requestId}] ❌ Failed to fetch profile:`, 
                        profileResponse.status, 
                        profileResponse.statusText);
                    // Don't block the token response
                } else {
                    const profileData  = await profileResponse.json();
                    platformUserId = profileData .id;
                    platformUsername = profileData .name;
                    console.log(`[${requestId}] 👤 Reddit Profile:`, profileData );
                }


                const socialAccountData: ISocialAccount = {
                    userId: userId,
                    platform: SocialPlatform.REDDIT,
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    tokenExpiry: expiryDate,
                    platformUserId: platformUserId,
                    platformUsername: platformUsername,
                    profileData: profileData
                }
                await this.socialMediaService.addSocialAccount(socialAccountData)

            } catch (profileErr) {
                console.error(`[${requestId}] ❌ Error fetching profile:`, profileErr);
                // Don't block the token response
            }
            
            if (!isResponseSent) {
                isResponseSent = true;
                 res.json(tokenData);
                 return
            }
        } catch (err) {
            console.error(`[${requestId}] ❌ Error exchanging token:`, err);
            if (!isResponseSent) {
                isResponseSent = true;
                 res.status(500).json({ error: 'Failed to exchange token' });
                 return
            }
        }
    }
}
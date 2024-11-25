import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { UserService } from '@/lib/services/user.service';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, username, web3_wallets } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;

    if (primaryEmail) {
      try {
        await UserService.createUser({
          clerkId: id,
          email: primaryEmail,
          name: username || undefined,
          walletAddress: web3_wallets?.[0]?.web3_wallet,
        });
      } catch (error) {
        console.error('Error creating user:', error);
        return new NextResponse('Error creating user', { status: 500 });
      }
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, username, web3_wallets } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;

    if (primaryEmail) {
      try {
        await UserService.updateUser(id, {
          name: username || undefined,
          walletAddress: web3_wallets?.[0]?.web3_wallet,
        });
      } catch (error) {
        console.error('Error updating user:', error);
        return new NextResponse('Error updating user', { status: 500 });
      }
    }
  }

  return new NextResponse('Success', { status: 200 });
}

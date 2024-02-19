import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

//   if (message?.input) {
//     text = message.input;
//   }

  if (message?.button === 2) {
    return NextResponse.redirect(
      'https://opensea.io',
      { status: 302 },
    );
  }

  return new NextResponse(
    getFrameHtmlResponse({
        buttons: [
            {
                label: 'Generate an image of your frame of mind',
            },
        ],
        image: {
            src: `${NEXT_PUBLIC_URL}/wyfom.webp`,
            aspectRatio: '1:1',
        },
        input: {
            text: 'Describe your frame of mind',
        },
        postUrl: `${NEXT_PUBLIC_URL}/api/result`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';

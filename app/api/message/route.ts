import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export async function GET() {
   return NextResponse.json({
      message: 'Pesan dari Server'
   })
}

export async function POST(request: NextRequest) {
   let message = await request.json()
   let messageFromClient: any = message.message
   // jika pesan di enkripsi
   if (message.type == 'auth') {
      let decryptedMessage = jwt.verify(messageFromClient, 'k3y3ncr1pt10n')
      let encMessageToClient = jwt.sign(`Secure Server : "${decryptedMessage}"`, 'k3y3ncr1pt10n')
      return NextResponse.json({
         message: encMessageToClient
      })
   }
   return NextResponse.json({
      message: `Un-secure Server : "${messageFromClient}"`
   })
}
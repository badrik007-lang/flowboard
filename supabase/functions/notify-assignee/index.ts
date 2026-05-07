import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const { record } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Get assignee email from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', record.user_id)
    .single()

  const { data: authUser } = await supabase.auth.admin.getUserById(record.user_id)
  const email = authUser?.user?.email
  const name = profile?.full_name || 'there'

  if (!email) return new Response('No email found', { status: 400 })

  // Send email via Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    },
    body: JSON.stringify({
      from: 'FlowBoard <onboarding@resend.dev>',
      to: [email],
      subject: `New task assigned to you`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #6366f1;">FlowBoard</h2>
          <p>Hi ${name},</p>
          <p>You've been assigned a new task:</p>
          <div style="background: #f4f4f8; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <strong>${record.body}</strong>
          </div>
          <p>Login to FlowBoard to view and update it.</p>
          <a href="https://flowboard-seven-fawn.vercel.app" style="background: #6366f1; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 8px;">Open FlowBoard</a>
        </div>
      `
    })
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), { status: 200 })
})
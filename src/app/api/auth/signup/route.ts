import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient<any>({ cookies })
    const { email, password, fullName, company } = await req.json()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // If a user is created, also add to the users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          company: company,
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        // We don't want to return an error here as the auth account was created successfully
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in signup route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
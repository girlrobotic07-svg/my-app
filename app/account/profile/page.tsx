'use client'

import { useState, useEffect, useRef } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ProfilePage() {
  const supabase = createSupabaseBrowser()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      setUserId(user.id)
      setEmail(user.email ?? null)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name ?? '')
        setAvatarUrl(profile.avatar_url)
      }
    }
    loadProfile()
  }, [])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    setUploading(true)
    setError(null)

    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // Save avatar URL to profile
    await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('id', userId)

    setAvatarUrl(data.publicUrl)
    setUploading(false)
    setMessage('Avatar updated!')
  }

  async function handleSave() {
    if (!userId) return
    setSaving(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) setError(error.message)
    else setMessage('Profile saved successfully!')

    setSaving(false)
  }

  // Get initials for avatar placeholder
  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : email?.[0]?.toUpperCase() ?? '?'

  return (
    <main className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">

        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={80}
                height={80}
                className="rounded-full object-cover w-20 h-20 border border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-500">
                {initials}
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 2MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
        </div>

        {/* Full name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email ?? ''}
            disabled
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed here</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </main>
  )
}
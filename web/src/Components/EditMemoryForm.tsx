'use client'

import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { Camera } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import './NewEditMemoryForm/index.css'
import { DateStructure } from '@/helper/date-structure'

interface Memory {
  id: string
  coverUrl: string
  content: string
  isPublic: boolean
  createdAt: string
}

export function EditMemoryForm() {
  const router = useRouter()
  const pathname = usePathname()

  const [idMemory, setIdMemory] = useState('')
  const [tokenUser, setTokenUser] = useState<string | undefined>()
  const [memory, setMemory] = useState<Memory>()

  const [contentNew, setContentNew] = useState('')
  const [isPublicNew, setIsPublicNew] = useState<boolean>()
  const [coverUrlNew, setCoverUrlNew] = useState('')

  const date = new Date(Date.now())
  date.setDate(date.getDate())
  const dateMaxNow = date.toISOString().slice(0, 10)

  async function searchIdMemory() {
    const memoryUrl = pathname.split('/')
    setIdMemory(memoryUrl[2])

    const token = Cookie.get('token')
    setTokenUser(token)

    const response = await api.get(`/memories/${memoryUrl[2]}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const memories: Memory = response.data

    if (memories) {
      setMemory({
        ...memories,
        createdAt: DateStructure(memories.createdAt),
      })
    }
  }

  useEffect(() => {
    searchIdMemory()
  }, [])

  console.log(memory)

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('coverUrl')

    let coverUrl = ''

    if (fileToUpload && coverUrlNew) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)

      coverUrl = uploadResponse.data.fileUrl
    }

    console.log(memory)
    console.log(formData.get('memoryNewDate'))

    await api.put(
      `/memories/${idMemory}`,
      {
        coverUrl: coverUrl || memory?.coverUrl,
        content: contentNew || memory?.content,
        isPublic: isPublicNew || memory?.isPublic,
        createdAt:
          new Date(String(formData.get('memoryNewDate'))) || memory?.createdAt,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenUser}`,
        },
      },
    )

    router.push('/')
  }

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setCoverUrlNew(previewURL)
  }

  return (
    <form
      onSubmit={handleCreateMemory}
      className="flex flex-1 flex-col gap-2 pb-16 pl-16 pr-16"
    >
      <div className="mb-3 flex items-center gap-2 text-sm text-gray-50 before:h-px before:w-5 before:bg-gray-50">
        <input
          type="date"
          name="memoryNewDate"
          id="memoryNewDate"
          max={dateMaxNow}
          className="border-0 bg-transparent"
          defaultValue={memory?.createdAt}
          placeholder="asdasdad"
        />
      </div>
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>

        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            defaultChecked={memory?.isPublic}
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
            onChange={(e) => {
              setIsPublicNew(Boolean(e.target.value))
            }}
          />
          Tornar memória pública
        </label>
      </div>

      <input
        onChange={onFileSelected}
        name="coverUrl"
        type="file"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
      />

      {coverUrlNew ? (
        <img
          src={coverUrlNew}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      ) : (
        <img
          src={memory?.coverUrl}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}

      <textarea
        name="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        defaultValue={memory?.content}
        onChange={(e) => setContentNew(e.target.value)}
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
      />

      <button
        type="submit"
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  )
}

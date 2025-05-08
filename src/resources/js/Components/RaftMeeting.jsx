import React from 'react'
import { useNavigate } from 'react-router-dom'

const RaftMeeting = () => {
  const navigate = useNavigate()

  const handleCreateDraft = () => {
    // ランダムなルームIDを生成
    const roomId = Math.random().toString(36).substring(2, 15)
    navigate(`/draft/${roomId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Raft Meeting App
            </h1>
            <div className="flex justify-center">
              <button
                onClick={handleCreateDraft}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                新しいドラフトを作成
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RaftMeeting

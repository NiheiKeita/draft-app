import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const DraftRoom = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const { roomId } = useParams()

  useEffect(() => {
    let channel = null

    const initializeWebSocket = () => {
      // 既存の接続をクリーンアップ
      if (channel) {
        channel.stopListening('DraftRoomEvent')
        window.Echo.leave(`draft-room.${roomId}`)
      }

      // 新しい接続を確立
      channel = window.Echo.channel(`draft-room.${roomId}`)

      // 接続成功時の処理
      channel.listen('DraftRoomEvent', (e) => {
        console.log('Received event:', e)
        setMessages((prevMessages) => [...prevMessages, e])
      })

      // 接続状態の監視
      const pusher = window.Echo.connector.pusher

      pusher.connection.bind('connected', () => {
        console.log('Connected to WebSocket')
        setIsConnected(true)
      })

      pusher.connection.bind('disconnected', () => {
        console.log('Disconnected from WebSocket')
        setIsConnected(false)
      })

      pusher.connection.bind('error', (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      })

      // 接続状態を確認
      if (pusher.connection.state === 'connected') {
        setIsConnected(true)
      } else {
        setIsConnected(false)
      }
    }

    // 初期化
    initializeWebSocket()

    // クリーンアップ関数
    return () => {
      if (channel) {
        channel.stopListening('DraftRoomEvent')
        window.Echo.leave(`draft-room.${roomId}`)
      }
    }
  }, [roomId])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">ドラフトルーム</h1>
              <div className="flex items-center space-x-2">
                <div
                  className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                />
                <span className="text-sm text-gray-600">
                  {isConnected ? '接続中' : '未接続'}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-md bg-gray-50 p-4">
                <p className="text-gray-700">
                  ドラフトルームが作成されました。メンバーを招待して選択肢を追加してください。
                </p>
              </div>
              {/* メッセージ履歴の表示 */}
              <div className="mt-4 space-y-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-blue-50 p-3 text-sm text-blue-700"
                  >
                    {JSON.stringify(message)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DraftRoom

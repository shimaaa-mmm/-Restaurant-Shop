import React from 'react'
import Modal from './Modal'

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'تأیید', danger = false }) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-sm">
      <div className="p-8 text-center">
        <span className="text-5xl mb-4 inline-block">{danger ? '⚠️' : '❓'}</span>
        <h3 className="font-display text-xl font-bold text-ink-700 mb-2">{title}</h3>
        <p className="text-ink-400 text-sm mb-8">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-full bg-cream-200 text-ink-600 font-semibold hover:bg-cream-200/70 transition"
          >
            انصراف
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 px-4 py-3 rounded-full font-bold transition-colors ${
              danger
                ? 'bg-paprika-500 text-white hover:bg-paprika-600'
                : 'bg-saffron-500 text-ink-800 hover:bg-saffron-400'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

import { useState } from 'react';

export const Modal = ({ material, handleCancel, handleSave, handleDelete }) => {
  const [titleValue, setTitleValue] = useState(material.title);
  const [descValue, setDescValue] = useState(material.desc);

  return (
    <div
      id="modal-container"
      style={{
        position: 'fixed',
        backgroundColor: '#323334',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          outline: '1px solid white',
          minWidth: '300px',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '16px',
        }}
      >
        <div className="modal-upper" style={{ display: 'flex', gap: '24px' }}>
          <input
            type="text"
            value={titleValue}
            style={{
              background: 'none',
              padding: '8px',
              flex: 1,
              fontSize: '20px',
            }}
            onChange={(e) => setTitleValue(e.target.value)}
          />
          <button
            className="clickable"
            style={{
              color: '#FF5858',
              background: 'none',
              border: 'none',
              fontSize: '16px',
            }}
            onClick={() => handleDelete(material.id)}
          >
            delete
          </button>
        </div>
        <textarea
          value={descValue}
          style={{
            background: 'none',
            padding: '8px',
            resize: 'none',
            fontSize: '16px',
            flex: 1,
          }}
          onChange={(e) => {
            const newDesc = e.target.value;
            if (newDesc.length < 120) setDescValue(e.target.value);
          }}
        />

        <div
          className="modal-save-close"
          style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}
        >
          <button
            className="clickable"
            style={{ background: 'none', border: 'none', fontSize: '16px' }}
            onClick={() => handleSave(titleValue, descValue, material.id)}
          >
            save
          </button>
          <button
            className="clickable"
            style={{ background: 'none', border: 'none', fontSize: '16px' }}
            onClick={() => handleCancel(material.id)}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
};

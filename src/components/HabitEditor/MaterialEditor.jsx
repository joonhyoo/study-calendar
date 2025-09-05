import { useState } from 'react';
import './Editor.css';

export const MaterialEditor = ({ material, handleSave }) => {
  const [isExpand, setIsExpand] = useState(false);
  const [title, setTitle] = useState(material.title);
  const [description, setDescription] = useState(material.description);

  const handleCancel = () => {
    setTitle(material.title);
    setDescription(material.description);
    setIsExpand(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        backgroundColor: '#323334',
      }}
    >
      <div className="upper" style={{ display: 'flex' }}>
        <input
          className="updatable-input"
          type="text"
          value={title}
          onChange={(e) => {
            console.log(e.target.value);
            if (e.target.value.length <= 20) setTitle(e.target.value);
          }}
          style={{
            fontSize: '20px',
            padding: '8px',
          }}
          onClick={() => setIsExpand(true)}
        />
        {isExpand && (
          <button className="clickable standard-button">archive</button>
        )}
      </div>
      {isExpand && (
        <textarea
          className={'updatable-input'}
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= 75) setDescription(e.target.value);
          }}
          style={{
            resize: 'none',
            outline: '0.25px solid #DADADA',
            height: '3em',
          }}
        />
      )}
      {isExpand && (
        <div
          style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
          }}
        >
          <button
            className="clickable standard-button"
            onClick={() => {
              handleSave(title, description, material.id);
              setIsExpand(false);
            }}
          >
            save
          </button>
          <button className="clickable standard-button" onClick={handleCancel}>
            cancel
          </button>
        </div>
      )}
    </div>
  );
};

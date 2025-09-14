import { useState } from 'react';
import { StyledButton } from './StyledButton';

export const MaterialEditor = ({
  material,
  handleSave,
  handleArchiveMaterial,
}) => {
  const [isExpand, setIsExpand] = useState(false);
  const [title, setTitle] = useState(material.title);
  const [description, setDescription] = useState(material.description);

  const handleCancel = () => {
    setTitle(material.title);
    setDescription(material.description);
    setIsExpand(false);
  };

  return (
    <div className="flex flex-col gap-[16px] p-[16px] bg-[#323334]">
      <div className="flex">
        <input
          className="w-full p-[8px] text-[20px]"
          type="text"
          value={title === 'material title' ? '' : title}
          placeholder={title}
          onChange={(e) => {
            const currTitle = e.target.value;
            if (currTitle.length <= 20) setTitle(currTitle);
            if (currTitle.length === 0) setTitle('material title');
          }}
          onClick={() => setIsExpand(true)}
        />
        {isExpand && (
          <StyledButton
            onClick={() => handleArchiveMaterial(material.id)}
            content="archive"
          />
        )}
      </div>
      {isExpand && (
        <textarea
          className="resize-none h-22 p-[8px] text-[16px] bg-[#404142]"
          placeholder="description"
          value={description === 'description' ? '' : description}
          onChange={(e) => {
            const currDesc = e.target.value;
            if (currDesc.length <= 100) setDescription(currDesc);
            if (currDesc.length === 0) setDescription('description');
          }}
        />
      )}
      {isExpand && (
        <div className="flex gap-[32px] justify-center">
          <button
            className="hover:cursor-pointer hover:brightness-75"
            onClick={() => {
              handleSave(title, description, material.id);
              setIsExpand(false);
            }}
          >
            save
          </button>
          <button
            className="hover:cursor-pointer hover:brightness-75"
            onClick={handleCancel}
          >
            cancel
          </button>
        </div>
      )}
    </div>
  );
};

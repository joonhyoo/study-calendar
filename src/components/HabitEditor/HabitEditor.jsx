import { useEffect, useState } from 'react';
import supabase from 'src/utils/supabase';
import { Modal } from './Modal';

const HabitEditor = ({ habit }) => {
  const [materials, setMaterials] = useState([]); // immutable, won't change.
  const [tempMaterials, setTempMaterials] = useState([]); // this one changes
  const [showModal, setShowModal] = useState(null);
  // fetches materials by habit id
  const fetchMaterials = async (habitId) => {
    const res = await supabase
      .from('habit_material')
      .select('title, description, id')
      .eq('habit_id', habitId);
    if (res) {
      setMaterials(res.data);
      setTempMaterials(res.data);
    }
  };

  useEffect(() => {
    fetchMaterials(habit.id);
  }, [habit.id]);

  const generateUniqueID = () => {
    return Math.random().toString().slice(2, 11);
  };

  const handleAddItem = () => {
    // new items probably need to be their own component to allow edit and delete
    const newItem = {
      title: 'Title',
      description: 'Description',
      id: generateUniqueID(),
    };
    const temp = [...tempMaterials];
    setShowModal({
      title: newItem.title,
      desc: newItem.description,
      id: newItem.id,
    });
    temp.push(newItem);
    setTempMaterials(temp);
  };

  const handleEdit = (material) => {
    setShowModal({
      id: material.id,
      title: material.title,
      desc: material.description,
    });
  };

  const handleCancel = (materialId) => {
    // finds if current id exists in materials
    const index = materials.findIndex((material) => material.id === materialId);
    //if not, remove it from temp
    if (index < 0) {
      handleDelete(materialId);
    }
    handleClose();
  };

  const handleClose = () => {
    setShowModal(null);
  };

  const handleSave = (newTitle, newDesc, materialId) => {
    handleClose();
    const temp = [...tempMaterials];
    const index = temp.findIndex((material) => material.id === materialId);
    temp[index].title = newTitle;
    temp[index].description = newDesc;
    setTempMaterials(temp);
  };

  const handleDelete = (materialId) => {
    handleClose();
    const temp = [...tempMaterials];
    const index = temp.findIndex((material) => material.id === materialId);
    // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
    if (index > -1) {
      // only splice array when item is found
      temp.splice(index, 1); // 2nd parameter means remove one item only
    }
    setTempMaterials(temp);
  };

  return (
    <div
      style={{
        backgroundColor: '#323334',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex' }}>
        <h2 style={{ fontSize: 24 }}>{habit.title}</h2>
      </div>
      {tempMaterials.map((material, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            className="editor-upper"
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontWeight: 300, fontSize: 20 }}>
              {material.title}
            </div>
            <div>
              <button
                className="clickable"
                style={{
                  color: '#58FFA9',
                  border: 'none',
                  background: 'none',
                }}
                onClick={() => handleEdit(material)}
              >
                edit
              </button>
            </div>
          </div>
          <div style={{ fontWeight: 300, color: '#C4C4C4', fontSize: 16 }}>
            {material.description}
          </div>
        </div>
      ))}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          justifyContent: 'center',
          fontWeight: 300,
        }}
      >
        <a
          className="clickable"
          style={{ padding: '8px 16px' }}
          onClick={handleAddItem}
        >
          add item
        </a>
      </div>
      {showModal && (
        <Modal
          material={showModal}
          handleCancel={handleCancel}
          handleDelete={handleDelete}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

export default HabitEditor;

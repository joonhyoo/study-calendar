import './DropDown.css';

function DropDown(props) {
  return (
    <div className="white-text drop-down">
      <p>Add an item</p>
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/96/Chevron-icon-drop-down-menu-WHITE.png"
          style={{ width: 16 }}
        />
      </div>
    </div>
  );
}

export default DropDown;

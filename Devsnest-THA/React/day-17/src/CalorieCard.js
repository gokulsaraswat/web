"use strict"

function CalorieCard({name, calorie}) {
  return (
    <div className="calorie-card">
      <div className="name">{name}</div>
      <div className="calories">Contains {calorie} calories</div>
    </div>
  );
}

export default CalorieCard;

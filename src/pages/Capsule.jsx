import "./../styles/capsule.css";

export default function Capsule() {
  const openDate = "12 июля 2026";

  return (
    <div className="capsule-container">
      <h2 className="capsule-title">🎁 Капсула времени</h2>
      <div className="capsule-lock">🔒</div>
      <p className="capsule-text">
        Капсула закрыта и откроется <strong>{openDate}</strong>.
      </p>
      <p className="capsule-subtext">
        Здесь будет особенное послание от нас для всех гостей ❤️
      </p>
    </div>
  );
}
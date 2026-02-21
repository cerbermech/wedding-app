import { Gift, LockKeyhole } from "lucide-react";
import "./../styles/capsule.css";

export default function Capsule() {
  const openDate = "8 июля 2026";

  return (
    <div className="capsule-container">
      <h2 className="capsule-title">
        <Gift size={28} strokeWidth={1.8} />
        <span>Капсула времени</span>
      </h2>
      <div className="capsule-lock">
        <LockKeyhole size={62} strokeWidth={1.6} />
      </div>
      <p className="capsule-text">
        Капсула закрыта и откроется <strong>{openDate}</strong>.
      </p>
      <p className="capsule-subtext">Здесь будет особенное послание от нас для всех гостей.</p>
    </div>
  );
}

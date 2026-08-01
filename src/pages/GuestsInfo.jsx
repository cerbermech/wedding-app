import { CircleHelp, Mail, MessageCircle, Phone, Sparkles, UsersRound } from "lucide-react";
import "./../styles/guestsInfo.css";

const faqItems = [
  {
    question: "Можно ли с детьми?",
    answer: "Да, можно. Пожалуйста, предупредите нас заранее, чтобы мы учли место и питание для маленьких гостей.",
  },
  {
    question: "Что дарить?",
    answer: "Лучший подарок для нас — ваш вклад в начало нашей семейной истории. Формат подарка оставляем на ваше усмотрение.",
  },
  {
    question: "Где парковаться?",
    answer: "В СНТ Березки заезжать не нужно: используйте дорогу слева вдоль забора. Напротив площадки есть парковка.",
  },
  {
    question: "Во сколько лучше приехать?",
    answer: "Можно приехать на официальную регистрацию в ЗАГС к 15:00 или сразу на площадку к 16:00. После регистрации у ЗАГСа гостей будет ждать автобус, который отвезёт всех на площадку. В 17:00 будет выездная регистрация для всех гостей.",
  },
  {
    question: "К кому обращаться?",
    answer: "По организационным вопросам в день свадьбы лучше писать или звонить контактам ниже.",
  },
];

const contacts = [
  {
    role: "Организатор",
    name: "Юлия",
    phone: "+79630551832",
    messageUrl: "https://t.me/+79630551832",
  },
  {
    role: "Координатор",
    name: "Кристина",
    phone: "+79962494766",
    messageUrl: "https://t.me/+79962494766",
  },
];

export default function GuestsInfo() {
  return (
    <div className="guests-info-container">
      <h2 className="guests-info-title">
        <UsersRound size={28} strokeWidth={1.8} />
        <span>Для гостей</span>
      </h2>

      <section className="guest-section" aria-labelledby="faq-title">
        <div className="guest-section-heading">
          <CircleHelp size={22} strokeWidth={1.8} />
          <h3 id="faq-title">FAQ</h3>
        </div>

        <div className="faq-list">
          {faqItems.map((item) => (
            <article className="faq-item" key={item.question}>
              <h4>{item.question}</h4>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guest-section" aria-labelledby="contacts-title">
        <div className="guest-section-heading">
          <Mail size={22} strokeWidth={1.8} />
          <h3 id="contacts-title">Контакты</h3>
        </div>

        <div className="contacts-grid">
          {contacts.map((contact) => (
            <article className="contact-card" key={contact.role}>
              <p className="contact-role">{contact.role}</p>
              {contact.name && <h4>{contact.name}</h4>}
              {contact.phone && (
                <div className="contact-actions">
                  <a href={`tel:${contact.phone}`} className="guest-action">
                    <Phone size={16} strokeWidth={1.9} />
                    <span>Позвонить</span>
                  </a>
                  <a href={contact.messageUrl} target="_blank" rel="noopener noreferrer" className="guest-action guest-action-secondary">
                    <MessageCircle size={16} strokeWidth={1.9} />
                    <span>Написать</span>
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="guest-reminder" aria-label="Напоминание для гостей">
        <Sparkles size={24} strokeWidth={1.7} />
        <div>
          <h3>Небольшое напоминание</h3>
          <p>Подтвердите участие, сохраните адрес площадки и загляните в программу перед выездом.</p>
        </div>
      </section>
    </div>
  );
}

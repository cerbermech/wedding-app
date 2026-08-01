import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Flame, ImagePlus, Trophy, User } from "lucide-react";
import "./../styles/challenges.css";

const API_CHALLENGES = "/api/challenges";
const API_PROOFS = "/api/proofs";
const GUEST_NAME_KEY = "weddingChallengeGuestName";
const MAX_FILES_PER_CHALLENGE = 3;
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const normalizeName = (name) => name.trim().replace(/\s+/g, " ");
const guestKey = (name) => normalizeName(name).toLocaleLowerCase("ru-RU");

const optimizePhoto = (file) => {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.size < 1024 * 1024) return Promise.resolve(file);

  return new Promise((resolve) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, 1920 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(blob && blob.size < file.size
          ? new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "photo"}.jpg`, { type: "image/jpeg" })
          : file),
        "image/jpeg",
        0.82,
      );
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    image.src = objectUrl;
  });
};

const readUploadResponse = async (response) => {
  const responseText = await response.text();
  let data = {};
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    // Прокси может вернуть HTML вместо JSON, например при превышении размера запроса.
  }

  if (!response.ok || !data.success) {
    if (response.status === 413) throw new Error("Файл не прошёл через сервер: превышен лимит размера запроса.");
    throw new Error(data.error || `Сервер отклонил загрузку (HTTP ${response.status || "без ответа"}).`);
  }
  return data;
};

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [guestName, setGuestName] = useState(() => localStorage.getItem(GUEST_NAME_KEY) || "");
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [uploadingId, setUploadingId] = useState(null);
  const fileInputs = useRef(new Map());

  useEffect(() => {
    Promise.all([
      fetch(API_CHALLENGES).then((res) => {
        if (!res.ok) throw new Error("Не удалось загрузить челленджи");
        return res.json();
      }),
      fetch(API_PROOFS).then((res) => {
        if (!res.ok) throw new Error("Не удалось загрузить результаты");
        return res.json();
      }),
    ])
      .then(([challengeData, proofData]) => {
        setChallenges(challengeData);
        setProofs(proofData);
      })
      .catch((error) => setPageError(error.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const normalized = normalizeName(guestName);
    if (normalized) localStorage.setItem(GUEST_NAME_KEY, normalized);
    else localStorage.removeItem(GUEST_NAME_KEY);
  }, [guestName]);

  const leaderboard = useMemo(() => {
    const challengePoints = new Map(challenges.map((challenge) => [challenge.id, challenge.points]));
    const guests = new Map();

    proofs.forEach((proof) => {
      const key = guestKey(proof.guest || "");
      if (!key || !challengePoints.has(proof.challengeId)) return;

      const entry = guests.get(key) || {
        name: normalizeName(proof.guest),
        points: 0,
        completed: new Set(),
      };

      if (!entry.completed.has(proof.challengeId)) {
        entry.completed.add(proof.challengeId);
        entry.points += challengePoints.get(proof.challengeId);
      }
      guests.set(key, entry);
    });

    return [...guests.values()]
      .map((entry) => ({ ...entry, completed: entry.completed.size }))
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name, "ru"));
  }, [challenges, proofs]);

  const currentGuest = leaderboard.find((guest) => guestKey(guest.name) === guestKey(guestName));

  const uploadFiles = async (challengeId, selectedFiles) => {
    const normalizedGuest = normalizeName(guestName);
    const ownProofCount = proofs.filter(
      (proof) => proof.challengeId === challengeId && guestKey(proof.guest) === guestKey(normalizedGuest),
    ).length;
    const availableSlots = MAX_FILES_PER_CHALLENGE - ownProofCount;
    const files = Array.from(selectedFiles || []);

    if (!normalizedGuest) {
      setPageError("Сначала введите своё имя.");
      return;
    }
    if (!files.length) return;
    if (availableSlots <= 0) {
      setPageError(`Для одного челленджа можно загрузить не больше ${MAX_FILES_PER_CHALLENGE} файлов.`);
      return;
    }
    if (files.length > availableSlots) {
      setPageError(`Можно добавить ещё только ${availableSlots} файл(а).`);
      return;
    }

    const invalidFile = files.find(
      (file) => (!file.type.startsWith("image/") && !file.type.startsWith("video/")) || file.size > MAX_FILE_SIZE,
    );
    if (invalidFile) {
      setPageError(`«${invalidFile.name}» должен быть фото/видео размером не более 50 МБ.`);
      return;
    }

    const caption = window.prompt("Добавить подпись? Можно оставить пустой.") ?? "";
    setUploadingId(challengeId);
    setPageError("");
    const uploaded = [];

    try {
      for (const file of files) {
        const preparedFile = await optimizePhoto(file);
        const formData = new FormData();
        formData.append("challengeId", String(challengeId));
        formData.append("guest", normalizedGuest);
        formData.append("caption", caption.trim());
        formData.append("proof", preparedFile);

        let response;
        try {
          response = await fetch(API_PROOFS, { method: "POST", body: formData });
        } catch {
          throw new Error("Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз.");
        }
        const data = await readUploadResponse(response);
        uploaded.push(data.proof);
      }
      setGuestName(normalizedGuest);
    } catch (error) {
      setPageError(error.message);
    } finally {
      if (uploaded.length) setProofs((previous) => [...previous, ...uploaded]);
      setUploadingId(null);
      fileInputs.current.forEach((input) => {
        if (input) input.value = "";
      });
    }
  };

  const openModal = (proof) => {
    setModalContent(
      proof.fileType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|heic)$/i.test(proof.file) ? (
        <img src={proof.file} alt={proof.caption || "Подтверждение челленджа"} />
      ) : (
        <video src={proof.file} controls autoPlay playsInline />
      ),
    );
  };

  return (
    <div className="challenges-container">
      <h2><Flame size={28} strokeWidth={1.8} /><span>Свадебные челленджи</span></h2>

      <section className="score-dashboard" aria-label="Таблица результатов">
        <div className="score-summary">
          <Trophy size={30} />
          <div>
            <strong>{currentGuest?.points || 0} очков</strong>
            <span>{currentGuest ? `${currentGuest.completed} выполнено` : "Введите имя и начинайте играть"}</span>
          </div>
        </div>
        <ol className="leaderboard">
          {leaderboard.slice(0, 10).map((guest, index) => (
            <li key={guestKey(guest.name)} className={guestKey(guest.name) === guestKey(guestName) ? "is-current" : ""}>
              <span>{index + 1}. {guest.name}</span><strong>{guest.points}</strong>
            </li>
          ))}
          {!leaderboard.length && <li className="leaderboard-empty">Пока никто не набрал очки</li>}
        </ol>
      </section>

      <div className="guest-input">
        <label htmlFor="challenge-guest">Ваше имя</label>
        <input id="challenge-guest" type="text" autoComplete="name" maxLength={60} placeholder="Например, Анна" value={guestName} onChange={(event) => setGuestName(event.target.value)} />
        <small>Имя сохранится только на этом устройстве.</small>
      </div>

      {pageError && <div className="challenge-message error" role="alert">{pageError}</div>}
      {loading && <div className="challenge-message">Загружаем челленджи…</div>}
      {!loading && !pageError && challenges.length === 0 && <div className="challenge-message">Челленджи пока не добавлены.</div>}

      <ul className="challenge-list">
        {challenges.map((challenge) => {
          const ownCount = proofs.filter(
            (proof) => proof.challengeId === challenge.id && guestKey(proof.guest) === guestKey(guestName),
          ).length;
          const disabled = !normalizeName(guestName) || uploadingId !== null || ownCount >= MAX_FILES_PER_CHALLENGE;
          return (
            <li key={challenge.id}>
              <div className="challenge-heading">
                <span>{challenge.text}</span><strong>+{challenge.points}</strong>
              </div>
              <div className="upload-actions">
                <input ref={(node) => fileInputs.current.set(`camera-${challenge.id}`, node)} id={`camera-${challenge.id}`} type="file" accept="image/*" capture="environment" onChange={(event) => uploadFiles(challenge.id, event.target.files)} disabled={disabled} />
                <label htmlFor={`camera-${challenge.id}`} className={`upload-label ${disabled ? "disabled" : ""}`}><Camera size={18} /> Сфотографировать</label>
                <input ref={(node) => fileInputs.current.set(`files-${challenge.id}`, node)} id={`files-${challenge.id}`} type="file" accept="image/*,video/*" multiple onChange={(event) => uploadFiles(challenge.id, event.target.files)} disabled={disabled} />
                <label htmlFor={`files-${challenge.id}`} className={`upload-label secondary ${disabled ? "disabled" : ""}`}><ImagePlus size={18} /> Выбрать файлы</label>
              </div>
              <small className="upload-hint">{uploadingId === challenge.id ? "Подготавливаем и загружаем…" : `${ownCount}/${MAX_FILES_PER_CHALLENGE} файлов · до 50 МБ каждый · фото оптимизируются автоматически`}</small>
              <div className="proofs">
                {proofs.filter((proof) => proof.challengeId === challenge.id).map((proof) => (
                  <div key={proof.id} className="proof">
                    <p><User size={13} strokeWidth={2} /> {proof.guest}</p>
                    {proof.caption && <p>{proof.caption}</p>}
                    {proof.fileType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|heic)$/i.test(proof.file) ? (
                      <img src={proof.file} alt={proof.caption || `Фото от ${proof.guest}`} loading="lazy" onClick={() => openModal(proof)} />
                    ) : (
                      <video src={proof.file} controls preload="metadata" playsInline onClick={() => openModal(proof)} />
                    )}
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {modalContent && <div className="modal" role="dialog" aria-modal="true" onClick={() => setModalContent(null)}><div className="modal-content" onClick={(event) => event.stopPropagation()}>{modalContent}</div></div>}
    </div>
  );
}

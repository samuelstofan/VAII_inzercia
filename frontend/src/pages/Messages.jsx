import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleString();
};

export default function Messages() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const selectedUserId = searchParams.get("user");
  const selectedVehicleId = searchParams.get("vehicle");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/prihlasenie");
      return;
    }

    api
      .get("/api/user")
      .then((res) => setCurrentUserId(res.data?.id ?? null))
      .catch((err) => {
        console.error(err);
        setError("Nepodarilo sa načítať užívateľa.");
      });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchThreads = async () => {
      setLoadingThreads(true);
      try {
        const res = await api.get("/api/messages/threads");
        setThreads(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Nepodarilo sa načítať správy.");
      } finally {
        setLoadingThreads(false);
      }
    };

    fetchThreads();
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.get("/api/messages", {
          params: { user: selectedUserId },
        });
        setMessages(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Nepodarilo sa načítať konverzáciu.");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [currentUserId, selectedUserId]);

  const activeThreadUser = useMemo(() => {
    if (!selectedUserId || !currentUserId) return null;
    const selectedId = Number(selectedUserId);
    const activeThread = threads.find((thread) => {
      const otherUserId =
        thread.sender_id === currentUserId
          ? thread.receiver_id
          : thread.sender_id;
      return otherUserId === selectedId;
    });

    if (!activeThread) return null;

    return activeThread.sender_id === currentUserId
      ? activeThread.receiver
      : activeThread.sender;
  }, [currentUserId, selectedUserId, threads]);

  const handleSelectThread = (userId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("user", userId);
      return next;
    });
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    setError("");

    if (!selectedUserId) {
      setError("Vyberte konverzáciu.");
      return;
    }

    const trimmed = messageText.trim();
    if (!trimmed) return;

    setSending(true);
    try {
      const payload = {
        receiver_id: Number(selectedUserId),
        message: trimmed,
      };
      if (selectedVehicleId) {
        payload.vehicle_id = Number(selectedVehicleId);
      }

      const res = await api.post("/api/messages", payload);
      setMessages((prev) => [...prev, res.data]);
      setMessageText("");

      const threadsRes = await api.get("/api/messages/threads");
      setThreads(threadsRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Nepodarilo sa odoslať správu.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Správy</h1>
          <p className="text-sm text-gray-600">
            Priamy chat medzi užívateľmi.
          </p>
        </div>
        <Link to="/" className="text-blue-600">
          Späť na domovskú stránku
        </Link>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Konverzácie</h2>
          {loadingThreads ? (
            <div className="text-sm text-gray-500">Načítam...</div>
          ) : threads.length === 0 ? (
            <div className="text-sm text-gray-500">Zatiaľ žiadne správy.</div>
          ) : (
            <div className="space-y-2">
              {threads.map((thread) => {
                const otherUser =
                  thread.sender_id === currentUserId
                    ? thread.receiver
                    : thread.sender;
                const isActive = Number(selectedUserId) === otherUser?.id;

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => handleSelectThread(otherUser?.id)}
                    className={`w-full text-left rounded-md border px-3 py-2 ${
                      isActive
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-semibold">
                      {otherUser?.name || `Uzivatel #${otherUser?.id}`}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {thread.message}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      {formatTimestamp(thread.created_at)}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white border rounded-lg p-4 flex flex-col">
          <div className="border-b pb-3 mb-4">
            <h2 className="text-lg font-semibold">
              {selectedUserId
                ? activeThreadUser?.name || `Uzivatel #${selectedUserId}`
                : "Vyberte konverzaciu"}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {loadingMessages ? (
              <div className="text-sm text-gray-500">Načítam správy...</div>
            ) : selectedUserId && messages.length === 0 ? (
              <div className="text-sm text-gray-500">
                Zatiaľ žiadne správy. Kontaktujte používateľa cez inzerát.
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.sender_id === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                        isMine
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div>{msg.message}</div>
                      {msg.vehicle?.title && (
                        <div className="text-xs opacity-80 mt-1">
                          Inzerát: {msg.vehicle.title}
                        </div>
                      )}
                      <div className="text-[11px] opacity-70 mt-1">
                        {formatTimestamp(msg.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder={
                selectedUserId ? "Napisat spravu..." : "Vyberte konverzaciu"
              }
              disabled={!selectedUserId || sending}
              className="flex-1 border rounded-md px-3 py-2"
            />
            <button
              type="submit"
              disabled={!selectedUserId || sending}
              className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {sending ? "Odosielam..." : "Odoslať"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}








"use client";

import { useEffect, useRef,useState } from "react";
import {Send, Plus, Image as ImageIcon, X, MessageSquare} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
  imageUrl?: string;
};

type Patient = {
  id: number;
  name: string;

}

export default function Home() {
  // --- State 관리 ---
  const [patients, setPatients] = useState<Patient[]>([]); // 사이드바 환자 목록
  const [messages, setMessages] = useState<Message[]>([]); // 현재 채팅 내용
  const [inputText, setInputText] = useState("");          // 입력창 텍스트
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택된 이미지 파일
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);     // 이미지 미리보기 URL

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("로딩 중...");


  useEffect(() => {
    // FastAPI 서버로 요청 보내기
    fetch("http://127.0.0.1:8000/") 
      .then((res) => res.json())
      .then((data) => {
        // 성공하면 메시지 변경
        setMessage(data.message);
        console.log("백엔드 응답:", data);
      })
      .catch((error) => {
        console.error("에러 발생:", error);
        setMessage("백엔드 연결 실패 ㅠㅠ");
      });
  }, []);

  // 1. 채팅창 구현
  const createNewPatient = () => {
    const newId = Date.now()
    const newPatient = {id:newId, name: `환자 #${patients.length + 1}`};

    if (!patients.some((p) => p.id === newPatient.id)) {
      setPatients([newPatient, ...patients]);
    }

    // 대화창 초기화
    setMessages([]);
    setInputText("");
    setSelectedImage(null);
    setPreviewUrl(null);
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }

  };

  // 3. 메시지 전송 (백엔드 통신 시뮬레이션)
  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    // 사용자 메시지 추가
    const userMsg: Message = {
      role: "user",
      text: inputText,
      imageUrl: previewUrl || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);

    // 입력창 초기화
    setInputText("");
    setSelectedImage(null);
    setPreviewUrl(null);

    // TODO: 여기서 백엔드(FastAPI)로 formData 전송
    // const formData = new FormData();
    // formData.append("file", selectedImage);
    // formData.append("text", inputText);
    
    // (테스트용) 1초 뒤 AI 응답 시뮬레이션
    setTimeout(() => {
      const aiMsg: Message = {
        role: "assistant",
        text: "X-ray 분석 결과, 폐렴 소견이 관찰됩니다. (GPT 생성 답변 예시)",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };


  // 자동 스크롤
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
    

// --- UI 렌더링 ---
  return (
    // 전체 레이아웃 (Flex)
    <div className="flex h-screen bg-zinc-900 text-zinc-100 font-sans overflow-hidden">
      
      {/* 🟢 왼쪽 사이드바 (환자 목록) */}
      <aside className="w-64 bg-zinc-950 flex flex-col border-r border-zinc-800">
        {/* 새 환자 버튼 */}
        <div className="p-4">
          <button
            onClick={createNewPatient}
            className="flex items-center gap-3 w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors text-sm font-medium text-zinc-200"
          >
            <Plus size={18} />
            <span>새로운 환자 추가</span>
          </button>
        </div>

        {/* 환자 리스트 */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <p className="px-4 py-2 text-xs font-semibold text-zinc-500">최근 기록</p>
          {patients.map((patient) => (
            <button
              key={patient.id}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-zinc-900 rounded-lg transition-colors truncate"
            >
              <MessageSquare size={16} className="text-zinc-500" />
              <span className="truncate">{patient.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* 🟢 중앙 메인 컨테이너 */}
      <main className="flex-1 flex flex-col relative max-w-5xl mx-auto w-full">
        
        {/* 채팅 영역 */}
        <section className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.length === 0 ? (
            // 텅 빈 초기 화면 (Gemini 느낌)
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <div className="p-4 bg-zinc-800 rounded-2xl">
                <ImageIcon size={48} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">X-ray 진단 보조 AI</h2>
              <p className="text-sm text-zinc-400">이미지를 업로드하거나 증상을 입력하세요.</p>
            </div>
          ) : (
            // 대화 목록
            messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === "assistant" ? "" : "justify-end"}`}>
                {/* 봇 아이콘 */}
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">AI</div>
                )}
                
                {/* 말풍선 */}
                <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "bg-zinc-800 p-4 rounded-2xl rounded-tr-none" : ""}`}>
                  {msg.imageUrl && (
                    <img src={msg.imageUrl} alt="upload" className="max-w-sm rounded-lg border border-zinc-700" />
                  )}
                  {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </section>

        {/* 하단 입력 바 (Floating) */}
        <section className="p-6 pt-0">
          <div className="relative bg-zinc-800 rounded-3xl p-2 pl-4 pr-2 flex flex-col shadow-lg border border-zinc-700">
            
            {/* 이미지 미리보기 (있을 때만 표시) */}
            {previewUrl && (
              <div className="relative w-fit mb-2 ml-2 mt-2">
                <img src={previewUrl || ""} alt="preview" className="h-20 rounded-lg border border-zinc-600" />
                <button 
                  onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
                  className="absolute -top-2 -right-2 bg-zinc-600 rounded-full p-1 hover:bg-zinc-500"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* 이미지 업로드 버튼 */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors"
                title="이미지 업로드"
              >
                <ImageIcon size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageSelect} 
                className="hidden" 
                accept="image/*"
              />

              {/* 텍스트 입력 */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="X-ray에 대한 질문이나 증상을 입력하세요..."
                className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 py-3"
              />

              {/* 전송 버튼 */}
              <button 
                onClick={handleSendMessage}
                disabled={!inputText && !selectedImage}
                className={`p-2 rounded-full transition-colors ${
                  inputText || selectedImage ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-700 text-zinc-500"
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-zinc-500 mt-3">
            AI 진단 결과는 참고용이며, 정확한 진단은 전문의와 상담하세요.
          </p>
        </section>

      </main>
    </div>
  );
}


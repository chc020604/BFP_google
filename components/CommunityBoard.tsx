import React from 'react';

const CommunityBoard: React.FC = () => {
  const posts = [
    { id: 1, title: "이번 주 광안리 드론쇼 명당 추천 좀 해주세요!", author: "부산갈매기", date: "2025.11.20", views: 124, likes: 12, comments: 5, type: "질문" },
    { id: 2, title: "태종대 자동차 극장 다녀왔는데 분위기 미쳤네요 (사진유)", author: "감성캠퍼", date: "2025.11.19", views: 342, likes: 56, comments: 23, type: "후기" },
    { id: 3, title: "불꽃축제 티켓 양도합니다 (R석 2매)", author: "티켓요정", date: "2025.11.18", views: 89, likes: 0, comments: 2, type: "양도" },
    { id: 4, title: "부산 혼자 여행 2박3일 코스 공유합니다", author: "프로혼행러", date: "2025.11.18", views: 567, likes: 88, comments: 41, type: "정보" },
    { id: 5, title: "벡스코 일러스트페어 주차 팁 알려드립니다", author: "센텀주민", date: "2025.11.17", views: 210, likes: 34, comments: 11, type: "정보" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
            <span className="text-rose-500 font-bold text-sm tracking-wider">COMMUNITY</span>
            <h2 className="text-3xl font-black text-slate-900">여행 톡</h2>
            <p className="text-slate-500 mt-1">부산 축제와 여행에 대한 생생한 이야기를 나눠보세요.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            글쓰기
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {['전체', '후기', '질문', '정보', '동행', '양도'].map((cat, idx) => (
            <button key={cat} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${idx === 0 ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500'}`}>
                {cat}
            </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {posts.map((post) => (
            <div key={post.id} className="p-5 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold 
                            ${post.type === '후기' ? 'bg-blue-100 text-blue-600' : 
                              post.type === '질문' ? 'bg-orange-100 text-orange-600' :
                              post.type === '양도' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-600'
                            }
                        `}>
                            {post.type}
                        </span>
                        <h3 className="text-slate-800 font-bold text-lg line-clamp-1">{post.title}</h3>
                    </div>
                    <div className="flex items-center text-xs text-slate-400 gap-3">
                        <span>{post.author}</span>
                        <span>{post.date}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-400 text-sm shrink-0">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {post.views}
                    </div>
                    <div className="flex items-center gap-1 text-rose-400">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        {post.comments}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityBoard;
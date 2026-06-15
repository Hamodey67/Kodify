import { create } from 'zustand';

export interface MotivationalNotification {
  id: string;
  message: string;
  emoji: string;
}

// 1. Continuous Work Hourly Messages (Trigger 1)
const hourlyMessages = [
  { text: "ساعة كاملة وانت شغال! الكراسي تحسدك على ثباتك 💪", emoji: "💪" },
  { text: "مضت ساعة — روحك قوية بس جسمك يطلب قهوة ☕", emoji: "☕" },
  { text: "ساعة من العطاء المستمر! الصندوق يفخر بك يا بطل 🌟", emoji: "🌟" },
  { text: "مرت ساعة! أصابعك صارت أسرع من الكيبورد ⌨️", emoji: "⌨️" },
  { text: "ساعة كاملة! عيناك على الشاشة وقلبك مع الاستراحة 🍕", emoji: "🍕" },
  { text: "ساعة عمل متواصلة! طاقة خرافية كأنك شربت كرتون مشروب طاقة ⚡", emoji: "⚡" },
  { text: "مضت ساعة أخرى! الأرقام تطير من تحت يديك مثل السحر 🪄", emoji: "🪄" }
];

// 2. Sales Count Milestone Messages (Trigger 2)
const salesMilestoneMessages: Record<number, { text: string; emoji: string }[]> = {
  5: [
    { text: "5 مبيعات! البركة فيك 🌟", emoji: "🌟" },
    { text: "5 مبيعات! الصندوق بدأ يبتسم لك وللأرباح 💸", emoji: "💸" },
    { text: "خمس مبيعات! طاقة رهيبة والزبائن يحبونك 😍", emoji: "😍" },
    { text: "5 مبيعات كاملة! انطلاقة نارية اليوم 🔥", emoji: "🔥" },
    { text: "5 صفقات! البداية تبشر بالخير الكثير 🚀", emoji: "🚀" }
  ],
  10: [
    { text: "10 مبيعات! انت مو كاشير، انت آلة بيع بشرية 🤖", emoji: "🤖" },
    { text: "10 مبيعات! أصابعك تطير فوق الكيبورد مثل البرق ⚡", emoji: "⚡" },
    { text: "عشر مبيعات! الصندوق يغني ألحان السعادة 🎵", emoji: "🎵" },
    { text: "10 عمليات بيع! حان وقت فنجان قهوة كافئ به نفسك ☕", emoji: "☕" },
    { text: "10 مبيعات! أنت اليوم القائد الفعلي لقسم المبيعات 🏆", emoji: "🏆" }
  ],
  20: [
    { text: "20 مبيعة! المدير راح يزيد راتبك... بس بالأمنيات فقط 😂", emoji: "😂" },
    { text: "20 مبيعة! الصندوق يعلن الاستسلام أمام سرعتك 🏳️", emoji: "🏳️" },
    { text: "عشرون صفقة ناجحة! أنت لست كاشير، أنت بطل خارق 🦸", emoji: "🦸" },
    { text: "20 مبيعة! حتى الآلات تحسدك على هذا النشاط ⚙️", emoji: "⚙️" },
    { text: "20 مبيعة! واصل التقدم فالقمة بانتظارك 🏔️", emoji: "🏔️" }
  ],
  50: [
    { text: "50 مبيعة! اسمك راح يُنقش على جدار الشركة 🏆", emoji: "🏆" },
    { text: "50 مبيعة! أنت بطل المبيعات الخارق بلا منازع 👑", emoji: "👑" },
    { text: "خمسون عملية كاملة! الصندوق يطلب استراحة من كثرة العمل 💤", emoji: "💤" },
    { text: "50 صفقة ناجحة! لقد دخلت التاريخ كأسرع كاشير 📜", emoji: "📜" },
    { text: "50 مبيعة! فخر المتجر اليوم وكل يوم 🌟", emoji: "🌟" }
  ]
};

// 3. Revenue Milestone Messages (Trigger 3)
const revenueMilestoneMessages: Record<number, { text: string; emoji: string }[]> = {
  100000: [
    { text: "وصلنا 100 ألف دينار! الصندوق يبكي من الفرح 💰", emoji: "💰" },
    { text: "100 ألف دينار! الصندوق بدأ يمتلئ بالدفء والأوراق النقدية 💵", emoji: "💵" },
    { text: "مئة ألف دينار! الأرقام تلمع في الصندوق كلؤلؤ 💎", emoji: "💎" },
    { text: "100,000 دينار! خطوة رائعة نحو المليون 📈", emoji: "📈" },
    { text: "وصلنا 100 ألف! واصل يا ملك الصندوق 👑", emoji: "👑" }
  ],
  500000: [
    { text: "نص مليون! روح اشتري لنفسك شي 😎", emoji: "😎" },
    { text: "نصف مليون دينار! أرباحك اليوم تضاهي سرعة الضوء ⚡", emoji: "⚡" },
    { text: "500,000 دينار! الصندوق ثقيل جداً اليوم 💪", emoji: "💪" },
    { text: "نصف مليون! المحل اليوم مبارك بوجودك البركة فيك 🌟", emoji: "🌟" },
    { text: "نصف مليون دينار! أنت تصنع التاريخ اليوم 🚀", emoji: "🚀" }
  ],
  1000000: [
    { text: "مليون دينار!!! المحاسب صار يحبك أكثر من أهله 🎉", emoji: "🎉" },
    { text: "مليون دينار كاملة! الصندوق يرقص فرحاً وطرباً 🕺", emoji: "🕺" },
    { text: "مليون دينار عراقي! رسمياً أنت مغناطيس للمبيعات 🧲", emoji: "🧲" },
    { text: "لقد فعلتها! مليون دينار! أنت أسطورة المتجر الخالدة 👑", emoji: "👑" },
    { text: "مليون دينار! حان وقت الاحتفال الكبير وصوت الموسيقى 🥳", emoji: "🥳" }
  ]
};

interface MotivationalState {
  sessionSalesCount: number;
  sessionRevenue: number;
  sessionStartTime: number;
  lastShownHour: number;

  // Track last used message indices to prevent repeating twice in a row
  lastTrigger1Index: number;
  lastTrigger2Indices: Record<number, number>; // milestone -> index
  lastTrigger3Indices: Record<number, number>; // milestone -> index

  // Queue State
  queue: MotivationalNotification[];
  activeNotification: MotivationalNotification | null;

  // Actions
  initSession: () => void;
  recordSale: (amount: number) => void;
  checkHourlyTrigger: () => void;
  enqueue: (message: string, emoji: string) => void;
  popNotification: () => void;
  clearActive: () => void;
  resetSession: () => void;
}

export const useMotivationalStore = create<MotivationalState>((set, get) => ({
  sessionSalesCount: 0,
  sessionRevenue: 0,
  sessionStartTime: 0,
  lastShownHour: 0,

  lastTrigger1Index: -1,
  lastTrigger2Indices: {},
  lastTrigger3Indices: {},

  queue: [],
  activeNotification: null,

  initSession: () => {
    const state = get();
    if (state.sessionStartTime === 0) {
      set({
        sessionStartTime: Date.now(),
        lastShownHour: 0,
        sessionSalesCount: 0,
        sessionRevenue: 0,
        queue: [],
        activeNotification: null,
        lastTrigger1Index: -1,
        lastTrigger2Indices: {},
        lastTrigger3Indices: {}
      });
    }
  },

  recordSale: (amount) => {
    const state = get();
    const oldSales = state.sessionSalesCount;
    const newSales = oldSales + 1;
    const oldRevenue = state.sessionRevenue;
    const newRevenue = oldRevenue + amount;

    set({
      sessionSalesCount: newSales,
      sessionRevenue: newRevenue
    });

    // 1. Check Sales Count Milestones
    const milestonesToCheck = [5, 10, 20, 50];
    if (milestonesToCheck.includes(newSales)) {
      const messages = salesMilestoneMessages[newSales];
      if (messages && messages.length > 0) {
        const lastIdx = state.lastTrigger2Indices[newSales] ?? -1;
        let randomIdx = Math.floor(Math.random() * messages.length);
        while (randomIdx === lastIdx && messages.length > 1) {
          randomIdx = Math.floor(Math.random() * messages.length);
        }
        
        set((s) => ({
          lastTrigger2Indices: {
            ...s.lastTrigger2Indices,
            [newSales]: randomIdx
          }
        }));

        const selected = messages[randomIdx];
        get().enqueue(selected.text, selected.emoji);
      }
    }

    // 2. Check Revenue Milestones
    const revMilestones = [100000, 500000, 1000000];
    for (const milestone of revMilestones) {
      if (oldRevenue < milestone && newRevenue >= milestone) {
        const messages = revenueMilestoneMessages[milestone];
        if (messages && messages.length > 0) {
          const lastIdx = state.lastTrigger3Indices[milestone] ?? -1;
          let randomIdx = Math.floor(Math.random() * messages.length);
          while (randomIdx === lastIdx && messages.length > 1) {
            randomIdx = Math.floor(Math.random() * messages.length);
          }
          
          set((s) => ({
            lastTrigger3Indices: {
              ...s.lastTrigger3Indices,
              [milestone]: randomIdx
            }
          }));

          const selected = messages[randomIdx];
          get().enqueue(selected.text, selected.emoji);
        }
      }
    }
  },

  checkHourlyTrigger: () => {
    const state = get();
    if (state.sessionStartTime === 0) return;

    const elapsedMs = Date.now() - state.sessionStartTime;
    const elapsedHours = Math.floor(elapsedMs / (60 * 60 * 1000));

    if (elapsedHours > state.lastShownHour) {
      set({ lastShownHour: elapsedHours });

      // Trigger hourly message
      let randomIdx = Math.floor(Math.random() * hourlyMessages.length);
      while (randomIdx === state.lastTrigger1Index && hourlyMessages.length > 1) {
        randomIdx = Math.floor(Math.random() * hourlyMessages.length);
      }

      set({ lastTrigger1Index: randomIdx });

      const selected = hourlyMessages[randomIdx];
      get().enqueue(selected.text, selected.emoji);
    }
  },

  enqueue: (message, emoji) => {
    const newNotif: MotivationalNotification = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      emoji
    };
    set((s) => ({
      queue: [...s.queue, newNotif]
    }));
  },

  popNotification: () => {
    const state = get();
    if (state.queue.length === 0 || state.activeNotification) return;

    const next = state.queue[0];
    set((s) => ({
      activeNotification: next,
      queue: s.queue.slice(1)
    }));
  },

  clearActive: () => {
    set({ activeNotification: null });
  },

  resetSession: () => {
    set({
      sessionStartTime: 0,
      lastShownHour: 0,
      sessionSalesCount: 0,
      sessionRevenue: 0,
      queue: [],
      activeNotification: null,
      lastTrigger1Index: -1,
      lastTrigger2Indices: {},
      lastTrigger3Indices: {}
    });
  }
}));

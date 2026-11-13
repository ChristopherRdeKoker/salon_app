import { createObservable } from "@/state/observable";

export type NoticeType = {
  id: number;
  text: string;
};

export function createNoticeStore(initialTexts: readonly string[]) {
  let nextId = 1;
  const notices = createObservable<NoticeType[]>(initialTexts.map((text) => ({ id: nextId++, text })));

  const result = {
    subscribe: notices.subscribe,
    getSnapshot: notices.get,
    push: (text: string) => {
      const isDuplicate = notices.get().some((notice) => notice.text === text);
      if (!isDuplicate) notices.set([...notices.get(), { id: nextId++, text }]);
    },
    dismiss: (id: number) => notices.set(notices.get().filter((notice) => notice.id !== id)),
  };

  return result;
}

export type NoticeStoreType = ReturnType<typeof createNoticeStore>;

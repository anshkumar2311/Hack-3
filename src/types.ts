export interface Quote {
    chapter?: string;
    verse?: string;
    text?: string;
    quote?: string;
  }
  
  export interface Message {
    text: string;
    sender: 'user' | 'bot';
  }
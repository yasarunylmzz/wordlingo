import type {
  QuizDirection,
  StudyExercise,
  StudyMode,
} from "../domain/learning/types";

/** Session options passed from StudySetup into Flip / Learn. */
export type StudyRouteOptions = {
  mode?: StudyMode;
  shuffle?: boolean;
  hideMastered?: boolean;
  quizDirection?: QuizDirection;
  /** When true, LearnScreen skips its own setup chips and starts immediately. */
  autoStart?: boolean;
};

export type RootStackParamList = {
  // Boot / auth gate
  SplashScreen: undefined;

  // Unauthenticated stack (StackScreens when no valid JWT)
  Home: undefined;
  Login: undefined;
  SignIn: undefined;
  FirstScreen: undefined;
  TwoFactorAuth: undefined;

  // Authenticated stack
  BottomScreen: undefined;
  ProfileScreen: undefined;
  SearchScreen: undefined;
  AllDecks: undefined;
  CreateDeck: undefined;
  CardDecks: { deckId: string; deckTitle: string; initialAdding?: boolean };
  Onboarding: undefined;
  Welcome: undefined;
  MyAccount: undefined;
  FaceId: undefined;
  HelpAndSupport: undefined;
  AboutApp: undefined;
  StudySetup: { deckId: string; deckTitle: string };
  FlipCardScreen: {
    deckId: string;
    deckTitle: string;
  } & StudyRouteOptions;
  LearnScreen: {
    deckId: string;
    deckTitle: string;
  } & StudyRouteOptions;
  StudyResult: {
    deskId: string;
    deckTitle: string;
    correct: number;
    wrong: number;
    total: number;
    durationMs: number;
    points?: number;
    mode?: StudyMode;
    exercise?: StudyExercise;
    source?: "flip" | "quiz";
  };
  CreateCard: undefined;

  // Referenced by Home header; screen not registered yet
  NotificationScreen: undefined;
};

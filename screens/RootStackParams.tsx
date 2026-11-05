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
  CardDecks: { deckId: string; deckTitle: string };
  MyAccount: undefined;
  FaceId: undefined;
  HelpAndSupport: undefined;
  AboutApp: undefined;
  FlipCardScreen: { deckId: string; deckTitle: string };
  LearnScreen: { deckId: string; deckTitle: string };
  CreateCard: undefined;

  // Referenced by Home header; screen not registered yet
  NotificationScreen: undefined;
};

import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDecks } from "./hooks/useDecks";
import DeckCard from "./components/DeckCard";
import DeckHeader from "./components/DeckHeader";

const AllDecks = () => {
  const { deskList, refreshing, isDeleting, onRefresh, deleteDeck } =
    useDecks();
  const navigation = useNavigation();

  // Açık olan swipeable'ları izlemek için ref
  const swipeableRowRefs = useRef({});

  // Swipeable ref'ini ayarla
  const setSwipeableRef = (id, ref) => {
    swipeableRowRefs.current[id] = ref;
  };

  // Diğer açık swipeable'ları kapat
  const closeOtherSwipeables = (key) => {
    Object.keys(swipeableRowRefs.current).forEach((k) => {
      if (k !== key && swipeableRowRefs.current[k]) {
        swipeableRowRefs.current[k].close();
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <DeckHeader
        title="my decks"
        onAddPress={() => navigation.navigate("CreateDeck")}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScrollBeginDrag={() => {
          Object.keys(swipeableRowRefs.current).forEach((k) => {
            if (swipeableRowRefs.current[k]) {
              swipeableRowRefs.current[k].close();
            }
          });
        }}
      >
        {!deskList || deskList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>Gösterilecek kart yok.</Text>
          </View>
        ) : (
          deskList.map((deck, index) => (
            <View key={deck.ID} style={styles.deckContainer}>
              <DeckCard
                deck={deck}
                index={index}
                onDelete={deleteDeck}
                isDeleting={isDeleting}
                setSwipeableRef={setSwipeableRef}
                closeOtherSwipeables={closeOtherSwipeables}
              />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  // Ana konteyner
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 16,
    paddingBottom: 8,
    backgroundColor: "#f8fafc",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6A5ACD",
    flex: 1,
    marginLeft: 20,
  },
  addButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  // Scroll
  scrollView: {
    flex: 1,
  },

  // Deck konteyner
  deckContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },

  // Deck kart
  deckCardContainer: {
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  deckCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    flexDirection: "row",
    overflow: "hidden",
    borderLeftWidth: 5,
    borderLeftColor: "#6A5ACD",
  },
  deckIconContainer: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  deckIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#6A5ACD",
    justifyContent: "center",
    alignItems: "center",
  },
  deckContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    justifyContent: "center",
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d141c",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  deckDescription: {
    fontSize: 14,
    color: "#49709c",
    marginBottom: 8,
    lineHeight: 18,
  },
  deckMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardCountText: {
    fontSize: 13,
    color: "#49709c",
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#718096",
  },

  // Swipeable styles
  deleteAction: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    marginVertical: 6,
    marginRight: 16,
    borderRadius: 16,
  },
  deleteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});

export default AllDecks;

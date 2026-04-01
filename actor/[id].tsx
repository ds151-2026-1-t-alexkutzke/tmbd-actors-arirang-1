import { useLocalSearchParams, Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, FlatList, Pressable } from 'react-native';
import { api } from '../../src/api/tmdb';

export default function ActorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [actor, setActor] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        const [details, credits] = await Promise.all([
          api.get(`/person/${id}`),
          api.get(`/person/${id}/movie_credits`)
        ]);
        setActor(details.data);
        setMovies(credits.data.cast.sort((a: any, b: any) => b.popularity - a.popularity).slice(0, 15));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActorData();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ 
          uri: actor.profile_path 
            ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` 
            : 'https://via.placeholder.com/500x750?text=Sem+Foto' 
        }}
        style={styles.profilePic}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{actor.name}</Text>
        
        <Text style={styles.sectionTitle}>Biografia</Text>
        <Text style={styles.biography}>
          {actor.biography || "Biografia não disponível para este artista."}
        </Text>

        <Text style={styles.sectionTitle}>Filmografia</Text>
        <FlatList
          horizontal
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Link href={`/movie/${item.id}`} asChild>
              <Pressable style={styles.movieCard}>
                <Image
                  source={{ 
                    uri: item.poster_path 
                      ? `https://image.tmdb.org/t/p/w185${item.poster_path}` 
                      : 'https://via.placeholder.com/185x278?text=Sem+Poster' 
                  }}
                  style={styles.miniPoster}
                />
              </Pressable>
            </Link>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  profilePic: { width: '100%', height: 450 },
  content: { padding: 20 },
  name: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  biography: { color: '#D1D5DB', fontSize: 16, lineHeight: 24 },
  movieCard: { marginRight: 12 },
  miniPoster: { width: 110, height: 160, borderRadius: 4 }
});
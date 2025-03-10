import { color } from '@/assets/colors';
import Card from '@/components/Card';
import MyButton from '@/components/MyButton';
import MyText from '@/components/MyText';
import { CommonActivities } from '@/constant/StaticData';
import { Link } from 'expo-router';
import { StatusBar, } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, Image, ScrollView, StyleSheet, View } from 'react-native';
import Spacer from '@/components/Spacer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar hidden={true} />
      <Image source={require("../assets/images/gradient.png")} style={{ resizeMode: 'cover', position: 'absolute', top: 0, left: 0 }} />
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
          <Image source={require("../assets/images/nusa-mandiri.png")} style={{ height: 30, width: 30 }} />
          <Spacer width={10} />
          <MyText style={{ color: color.primary, }} fontWeight='semiBold' size='m'>{`Nusa Mandiri University`}</MyText>
        </View>
        <View style={{ paddingVertical: 20 }}>
          <MyText style={{ color: color.primary }} fontWeight='semiBold' size='xxl'>{`Hi, Students`}</MyText>
          <MyText style={{ color: color.primary }} fontWeight='bold' size='xl'>{`of Nusa Mandiri Jatiwaringin!`}</MyText>
        </View>
        <MyText style={{ color: color.secondary, }} fontWeight='bold' size='xxl'>{`Simple Todo List App`}</MyText>
      </View>
      <View >
        <MyText style={{ color: color.secondary, paddingLeft: 20, marginBottom: 10 }} fontWeight='semiBold' size='m'>{`Common Activities`}</MyText>
        <View>
          <ScrollView
            horizontal
            decelerationRate={'fast'}
            showsHorizontalScrollIndicator={false}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            <FlatList
              contentContainerStyle={{ alignSelf: 'flex-start' }}
              numColumns={Math.ceil(CommonActivities.length / 3)}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={CommonActivities}
              renderItem={({ item, index }) => <Card key={index.toString()} label={item} style={{ marginRight: 10, marginBottom: 10 }} />}
            />
          </ScrollView>
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 0.8, y: 0 }}
            colors={['#fff', '#ffffff10']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 300,
            }}
          />
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0.2, y: 0 }}
            colors={['#fff', '#ffffff10']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 300,
            }}
          />
        </View>
        <View style={{ padding: 20 }}>
          <Link href="/dashboard" asChild>
            <MyButton label='Continue' />
          </Link>
        </View>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: color.white,
    justifyContent: 'space-between'
  },
});

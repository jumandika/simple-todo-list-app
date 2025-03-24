import { color } from '@/assets/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    LayoutChangeEvent,
    StyleSheet,
    View
} from 'react-native';

interface SkeletonProps {
    isLoading: boolean;
    children: ReactNode;
    borderRadius?: number;
    widthPercentage?: `${number}%`;
}

const useSkeletonAnimation = (isLoading: boolean) => {
    const skeletonAnimate = useRef(new Animated.Value(0)).current;
    const fadeInAnimate = useRef(new Animated.Value(isLoading ? 0 : 1)).current;
    const fadeOutAnimate = useRef(new Animated.Value(isLoading ? 1 : 0)).current;

    useEffect(() => {
        if (isLoading) {
            const skeletonAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(skeletonAnimate, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                        easing: Easing.out(Easing.linear),
                    }),
                    // Animated.delay(300),
                ])
            );
            Animated.parallel([
                Animated.timing(fadeInAnimate, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeOutAnimate, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),

            ]).start();

            skeletonAnimation.start();
            return () => skeletonAnimation.stop();
        } else {
            Animated.parallel([
                Animated.timing(fadeInAnimate, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeOutAnimate, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
            return
        }
    }, [isLoading]);

    return { skeletonAnimate, fadeInAnimate, fadeOutAnimate };
};

const Skeleton: React.FC<SkeletonProps> = ({ isLoading, children, borderRadius, widthPercentage }) => {
    const { skeletonAnimate, fadeInAnimate, fadeOutAnimate } = useSkeletonAnimation(isLoading);
    const [size, setSize] = useState({ width: 0, height: 0 });

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
    };

    return (
        <View style={styles.wrapper}>
            {/* Content with smooth fade-in and zoom-in effect */}
            <Animated.View
                style={[
                    styles.content,
                    { opacity: fadeInAnimate },
                ]}
                onLayout={onLayout}
            >
                {children}
            </Animated.View>

            {/* Skeleton Effect */}
            {isLoading && size.width > 0 && size.height > 0 && (
                <Animated.View
                    style={[
                        styles.skeletonContainer,
                        { borderRadius, width: size.width, height: size.height, opacity: fadeOutAnimate },
                        widthPercentage && { width: widthPercentage }

                    ]}
                >
                    <Animated.View
                        style={[
                            styles.skeleton,
                            {
                                width: size.width,
                                height: size.height,
                                transform: [
                                    {
                                        translateX: skeletonAnimate.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-size.width, size.width],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={['#ffffff00', '#ffffff90', '#ffffff00']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{ width: size.width, height: size.height }}
                            locations={[0.0, 0.7, 1]}
                        />
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
    },
    content: {
        position: 'relative',
    },
    skeletonContainer: {
        backgroundColor: color.gray,
        overflow: 'hidden',
        position: 'absolute',
        borderRadius: 10,
    },
    skeleton: {
        overflow: 'hidden',
        position: 'absolute',
    },
});

export default Skeleton;
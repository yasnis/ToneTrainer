"use client";

import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, PanResponder, useWindowDimensions, ScrollView, Platform } from 'react-native';

type EmblaCarouselProps = {
  slides: React.ReactNode[];
  onSlideChange?: (index: number) => void;
};

// 外部から呼び出せるメソッドの型定義
export type EmblaCarouselHandle = {
  scrollToSlide: (index: number) => void;
};

export const EmblaCarousel = forwardRef<EmblaCarouselHandle, EmblaCarouselProps>(
  ({
    slides,
    onSlideChange,
  }, ref) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { width } = useWindowDimensions();
    const scrollViewRef = useRef<ScrollView>(null);
    // スクロールが手動で行われているかのフラグ
    const isManualScrolling = useRef(false);
    // 最後にsetActiveIndexを呼び出した時間
    const lastStateUpdate = useRef(Date.now());
    const contentWidth = width * 0.9 < 500 ? width * 0.9 - 48 : 452; // モーダル幅 - パディング

    // Web環境のみ: マウスドラッグ操作のためのイベントハンドラー
    useEffect(() => {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const container = document.querySelector('.embla-carousel-container');
        if (!container) return;
        
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        
        const handleMouseDown = (e: MouseEvent) => {
          isDragging = true;
          startX = e.clientX;
          currentX = startX;
          container.classList.add('grabbing');
          document.body.style.userSelect = 'none'; // ドラッグ中のテキスト選択を防止
        };
        
        const handleMouseMove = (e: MouseEvent) => {
          if (!isDragging) return;
          currentX = e.clientX;
        };
        
        const handleMouseUp = () => {
          if (!isDragging) return;
          
          const threshold = contentWidth * 0.2; // 20% のスワイプで次のスライドに移動
          const diff = currentX - startX;
          
          if (diff < -threshold && activeIndex < slides.length - 1) {
            // 左スワイプ - 次のスライドへ
            isManualScrolling.current = true;
            setActiveIndex(activeIndex + 1);
            lastStateUpdate.current = Date.now();
            setTimeout(() => {
              isManualScrolling.current = false;
            }, 500);
          } else if (diff > threshold && activeIndex > 0) {
            // 右スワイプ - 前のスライドへ
            isManualScrolling.current = true;
            setActiveIndex(activeIndex - 1);
            lastStateUpdate.current = Date.now();
            setTimeout(() => {
              isManualScrolling.current = false;
            }, 500);
          }
          
          isDragging = false;
          container.classList.remove('grabbing');
          document.body.style.userSelect = '';
        };
        
        container.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        return () => {
          container.removeEventListener('mousedown', handleMouseDown);
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [activeIndex, contentWidth, slides.length]);

    // 外部から呼び出せるメソッドを公開
    useImperativeHandle(ref, () => ({
      scrollToSlide: (index: number) => {
        if (index >= 0 && index < slides.length) {
          // 手動スクロールフラグを立てる
          isManualScrolling.current = true;
          // 状態を更新
          setActiveIndex(index);
          // 最後の状態更新時間を記録
          lastStateUpdate.current = Date.now();
          
          // スクロール位置を更新
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
              x: index * contentWidth,
              animated: true
            });
          }
          
          // 少し待ってからフラグをリセット（アニメーション終了後）
          setTimeout(() => {
            isManualScrolling.current = false;
          }, 500); // スクロールアニメーションの時間より長めに設定
        }
      }
    }));

    // 親コンポーネントへのスライド変更通知
    useEffect(() => {
      onSlideChange?.(activeIndex);
    }, [activeIndex, onSlideChange]);

    // タッチ操作
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dx) > 5;
        },
        onPanResponderRelease: (_, gestureState) => {
          const threshold = contentWidth * 0.2; // 20% のスワイプで次のスライドに移動
          
          if (gestureState.dx < -threshold && activeIndex < slides.length - 1) {
            // 左スワイプ
            isManualScrolling.current = true;
            setActiveIndex(activeIndex + 1);
            lastStateUpdate.current = Date.now();
            setTimeout(() => {
              isManualScrolling.current = false;
            }, 500);
          } else if (gestureState.dx > threshold && activeIndex > 0) {
            // 右スワイプ
            isManualScrolling.current = true;
            setActiveIndex(activeIndex - 1);
            lastStateUpdate.current = Date.now();
            setTimeout(() => {
              isManualScrolling.current = false;
            }, 500);
          }
        },
      })
    ).current;

    // スクロール時の処理
    const handleScroll = (event: any) => {
      // 手動スクロール中はスクロールイベントを無視
      if (isManualScrolling.current) return;
      
      // 最後の状態更新から短時間しか経っていない場合は無視（ループ防止）
      if (Date.now() - lastStateUpdate.current < 300) return;
      
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / contentWidth);
      
      if (index !== activeIndex && index >= 0 && index < slides.length) {
        setActiveIndex(index);
        lastStateUpdate.current = Date.now();
      }
    };

    // アクティブなスライドに自動スクロール
    useEffect(() => {
      // すでに手動スクロール中の場合は、この自動スクロールをスキップ
      if (isManualScrolling.current) return;
      
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: activeIndex * contentWidth,
          animated: true
        });
      }
    }, [activeIndex, contentWidth]);

    return (
      <View
        style={styles.container}
        {...(Platform.OS === 'web' ? { className: "embla-carousel-container" } : {})}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled={false} // pagingEnabledをオフにして手動で制御
          decelerationRate="fast" // 減速率を高めに設定
          snapToInterval={contentWidth} // スナップの間隔を指定
          snapToAlignment="center" // スナップの位置を中央に
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.scrollContent, 
            { width: contentWidth * slides.length }
          ]}
          {...panResponder.panHandlers}
        >
          {slides.map((slide, index) => (
            <View key={index} style={[styles.slide, { width: contentWidth }]}>
              {slide}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
);

EmblaCarousel.displayName = 'EmblaCarousel';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollContent: {
    flexDirection: 'row',
  },
  slide: {
    flex: 1,
  },
});
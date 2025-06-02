"use client";

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions, Platform, Image } from 'react-native';
import { Dialog } from './Dialog';
import { EmblaCarousel, EmblaCarouselHandle } from './EmblaCarousel';

type OnboardingModalProps = {
  open: boolean;
  lang: 'en' | 'ja';
  onLangChange: (lang: 'en' | 'ja') => void;
  onClose: () => void;
};

type SlideContent = {
  key: string;
  en: [
    {
      title: string;
      content: string;
    }
  ],
  ja: [
    {
      title: string;
      content: string;
    }
  ],
};

const slides: SlideContent[] = [
  {
    key: 'intro',
    en: [
        {
            title: 'Welcome to Tone Trainer!',
            content: 'Break free from fixed note orders — random prompts train real-time fretboard recall.',
        },
        {
            title: 'Quick tip:',
            content: 'Limit practice to one string or a narrow fret range. Short, focused loops lock the notes into muscle memory.',
        },
    ],
    ja: [
        {
            title: 'Tone Trainerへようこそ！',
            content: '指板をいつもの順番で覚える癖をリセット。ランダムな音名提示で本当の記憶を鍛えましょう。',
        },
        {
            title: '上達のコツ:',
            content: '弦を 1 本に絞ったり、フレット範囲を限定して繰り返しましょう。短い集中ループが記憶を定着させます。',
        },
    ],
  },
  {
    key: 'usage',
    en:[
        {
            title: 'How to use',
            content: '- Tap the big note → Start / Pause\n- Pick your note pool & BPM\n- Choose meter, sound, accent\n- Change note every N measures',
        },
        {
            title: 'Support',
            content: '- [@sinsay_guitar](https://x.com/sinsay_guitar)\n- [Buy me a coffee](https://www.buymeacoffee.com/sinsay)',
        },
    ],
    ja:[
        {
            title: '使い方',
            content: '・ 大きな音名タップで開始／停止\n・ 練習したい音名と BPM を選択\n・ 拍子・音色・アクセントを設定\n・ 何小節ごとに音名を切り替えるか指定',
        },
        {
            title: 'サポート',
            content: '・ [@sinsay_guitar](https://x.com/sinsay_guitar)\n・ [Buy me a coffee](https://www.buymeacoffee.com/sinsay)',
        },
    ]
  },
];

// Webプラットフォーム用のスタイル拡張
const WebModalGradient = Platform.OS === 'web' ? 
  ({ children, style }: { children: React.ReactNode, style?: any }) => (
    <div 
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #f0f0f2)',
        borderRadius: '16px',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  ) : () => null;

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  open,
  lang,
  onLangChange,
  onClose,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { width } = useWindowDimensions();
  // カルーセルへの参照を追加
  const carouselRef = useRef<EmblaCarouselHandle>(null);

  // モーダルが閉じられたときにスライドをリセット
  useEffect(() => {
    if (!open) {
      setCurrentSlide(0);
      // カルーセルもリセット
      carouselRef.current?.scrollToSlide(0);
    }
  }, [open]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  // ドットインジケーターからスライドを変更する関数
  const changeSlide = (index: number) => {
    setCurrentSlide(index);
    // 直接カルーセルのスライドを変更
    carouselRef.current?.scrollToSlide(index);
  };

  // LinkTextコンポーネントの作成 - Webではaタグに、ネイティブではテキストに変換
  const LinkText = ({ content }: { content: string }) => {
    // Markdownリンク記法を検出する正規表現
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    if (Platform.OS === 'web') {
      // Web環境ではHTMLを使用
      // 改行をbrタグに変換し、Markdownリンクをaタグに変換
      let htmlContent = content.replace(/\n/g, '<br>');
      htmlContent = htmlContent.replace(linkRegex, '<a href="$2" target="_blank" style="color: #3D9B8F; text-decoration: none;">$1</a>');
      
      return (
        <div 
          style={{
            fontSize: 15,
            lineHeight: '22px',
            color: '#555',
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    } else {
      // ネイティブ環境では単純にテキスト表示
      return <Text style={styles.slideContent}>{content}</Text>;
    }
  };

  // 各スライドのコンテンツをレンダリング
  const slideContents = slides.map((slide, index) => (
    <View key={index} style={styles.slideContainer}>
      {slide[lang].map((section, sectionIndex) => (
        <View key={sectionIndex} style={sectionIndex > 0 ? styles.sectionContainer : null}>
          {Platform.OS === 'web' ? (
            <h2 style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 8,
              color: '#333',
            }}>
              {section.title}
            </h2>
          ) : (
            <Text style={styles.slideTitle}>
              {section.title}
            </Text>
          )}
          <LinkText content={section.content} />
        </View>
      ))}
    </View>
  ));

  const modalWidth = Math.min(500, width * 0.9); // 画面幅の90%か500pxの小さい方

  return (
    <Dialog open={open} onClose={onClose}>
      <View style={[styles.modalContainer, { width: modalWidth }]}>
        <WebModalGradient />
        <View style={styles.contentContainer}>
          {/* ロゴ */}
          <View style={styles.logoContainer}>
            <Image 
              source={Platform.OS === 'web' ? { uri: '/images/logo.svg' } : { uri: 'https://tonetrainer.app/images/logo.svg' }}
              style={styles.logo}
              resizeMode="contain"
            />
            
            {/* 言語切り替え - ロゴの下に配置 */}
            <View style={styles.langToggle}>
              <Pressable
                style={[styles.langButton, lang === 'en' && styles.activeLang]}
                onPress={() => onLangChange('en')}
              >
                <Text style={styles.langText}>EN</Text>
              </Pressable>
              <Text style={styles.langSeparator}>·</Text>
              <Pressable
                style={[styles.langButton, lang === 'ja' && styles.activeLang]}
                onPress={() => onLangChange('ja')}
              >
                <Text style={styles.langText}>JA</Text>
              </Pressable>
            </View>
          </View>

          {/* スライドカルーセル */}
          <View style={styles.carouselContainer}>
            <EmblaCarousel 
              slides={slideContents}
              onSlideChange={handleSlideChange}
              ref={carouselRef} // 参照を渡す
            />
          </View>

          {/* ドットインジケーター - クリック/タップ可能に */}
          <View style={styles.dotsContainer}>
            {slides.map((_, index) => (
              <Pressable
                key={index}
                style={[
                  styles.dot,
                  index === currentSlide && styles.activeDot,
                ]}
                onPress={() => {
                  changeSlide(index);
                }}
                {...(Platform.OS === 'web' ? { className: "dot-indicator" } : {})}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              />
            ))}
          </View>
        </View>

        {/* 閉じるボタン */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </Pressable>
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    maxWidth: 500,
    maxHeight: '95%',
    margin: 'auto',
    position: 'relative',
    overflow: 'hidden',
  },
  containerWeb: {
    background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  containerNative: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  logo: {
    width: 150,
    height: 50,
  },
  langToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  langButton: {
    padding: 4,
    borderRadius: 4,
  },
  activeLang: {
    backgroundColor: '#f0f0f0',
  },
  langText: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  langSeparator: {
    marginHorizontal: 8,
  },
  carouselContainer: {
    flex: 1,
    minHeight: 300, // 最小高さを増加
    marginBottom: 16,
  },
  slideContainer: {
    padding: 10,
    height: '100%',
  },
  sectionContainer: {
    marginTop: 24,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  slideContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 6,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 'auto',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB', // BeatPositionDisplayと同じ色
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#3D9B8F', // BeatPositionDisplayと同じプライマリーカラー
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    maxWidth: 500,
    maxHeight: '95%',
    margin: 'auto',
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 3,
        }
    ),
  },
});
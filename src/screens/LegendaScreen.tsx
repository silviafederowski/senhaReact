import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ArrowPairIcon, Dot, DotPairIcon, GREEN, YELLOW } from '../components/ResultIcons';
import { FONT_TITLE } from '../styles/fonts';

// Reference window height this screen's content was designed at. On shorter screens
// everything shrinks proportionally so the whole legend fits without scrolling.
const BASELINE_HEIGHT = 780;
const MIN_SCALE = 0.7;

interface LegendEntry {
  icon: React.ReactNode;
  description: string;
  scope: string;
}

const ENTRIES: LegendEntry[] = [
  {
    icon: <DotPairIcon color={GREEN} size={15} />,
    description: 'Par de caracteres certo, na posição correta.',
    scope: 'Linha dupla',
  },
  {
    icon: <ArrowPairIcon color={GREEN} size={20} />,
    description: 'Par de caracteres invertido (posições trocadas), na posição correta.',
    scope: 'Linha dupla',
  },
  {
    icon: <DotPairIcon color={YELLOW} size={15} />,
    description: 'Par de caracteres certo, mas em outra posição.',
    scope: 'Linha dupla',
  },
  {
    icon: <ArrowPairIcon color={YELLOW} size={20} />,
    description: 'Par de caracteres invertido, em outra posição.',
    scope: 'Linha dupla',
  },
  {
    icon: <Dot color={GREEN} size={15} />,
    description: 'Caractere certo, na posição correta.',
    scope: 'Linha única e linha dupla',
  },
  {
    icon: <Dot color={YELLOW} size={15} />,
    description: 'Caractere certo, mas em outra posição.',
    scope: 'Linha única e linha dupla',
  },
];

export function LegendaScreen() {
  const { height: windowHeight } = useWindowDimensions();
  const scale = Math.min(1, Math.max(MIN_SCALE, windowHeight / BASELINE_HEIGHT));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[styles.content, { padding: Math.round(16 * scale) }]}
        minimumZoomScale={1}
        maximumZoomScale={2.5}
        pinchGestureEnabled
      >
        {ENTRIES.map((entry, i) => (
          <View key={i} style={[styles.row, { paddingVertical: Math.round(12 * scale) }]}>
            <View style={styles.iconBox}>{entry.icon}</View>
            <View style={styles.textBox}>
              <Text style={[styles.description, { fontSize: Math.round(14 * scale) }]}>{entry.description}</Text>
              <Text style={[styles.scope, { fontSize: Math.round(12 * scale) }]}>{entry.scope}</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.tipTitle, { fontSize: Math.round(20 * scale), marginTop: Math.round(20 * scale) }]}>
          Marcar um caractere
        </Text>
        <Text style={[styles.tipText, { fontSize: Math.round(13 * scale), lineHeight: Math.round(19 * scale) }]}>
          Toque em um caractere na lista de tentativas para alternar entre três estados:
          verde (confirmado — será oferecido automaticamente na mesma posição nas
          próximas tentativas), vermelho (excluído — fica bloqueado no teclado, piscando
          se você tentar usá-lo) e de volta à cor original.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  iconBox: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: {
    flex: 1,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  scope: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  tipTitle: {
    fontSize: 20,
    fontFamily: FONT_TITLE,
    marginTop: 20,
    marginBottom: 6,
    textAlign: 'center',
    color: '#fff',
  },
  tipText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 19,
  },
});

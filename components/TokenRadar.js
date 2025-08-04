// components/TokenRadar.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Svg, { G, Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';

// Componente TokenRadar recibe por prop el array `tokens`
// tokens: [{ symbol: string, value: number }, ...]
// onSelect: función callback al pulsar un token
export default function TokenRadar({ tokens, onSelect }) {
  const levels = 5;       // número de círculos concéntricos
  const size = 250;       // dimensiones del SVG (ancho y alto)
  const angleSlice = (2 * Math.PI) / tokens.length;
  const radius = (size / 2) * 0.8;
  const maxValue = Math.max(...tokens.map(t => t.value));

  // Puntos del polígono de datos
  const radarPoints = tokens.map((t, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    const r = (t.value / maxValue) * radius;
    return [
      size / 2 + r * Math.cos(angle),
      size / 2 + r * Math.sin(angle),
    ];
  });

  // Puntos de los niveles de fondo
  const bgLevels = Array.from({ length: levels }, (_, i) => {
    const r = radius * ((i + 1) / levels);
    return tokens.map((_, j) => {
      const angle = j * angleSlice - Math.PI / 2;
      return [
        size / 2 + r * Math.cos(angle),
        size / 2 + r * Math.sin(angle),
      ];
    });
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {/* Fondos concéntricos */}
          {bgLevels.map((points, i) => (
            <Polygon
              key={i}
              points={points.map(p => p.join(',')).join(' ')}
              fill="none"
              stroke="#444"
            />
          ))}

          {/* Ejes y etiquetas */}
          {tokens.map((t, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            const x = size / 2 + radius * Math.cos(angle);
            const y = size / 2 + radius * Math.sin(angle);
            return (
              <G key={i}>
                {/* Línea del eje */}
                <Line
                  x1={size / 2} y1={size / 2}
                  x2={x}         y2={y}
                  stroke="#555"
                />
                {/* Etiqueta del símbolo */}
                <SvgText
                  x={x}
                  y={y}
                  fill="#fff"
                  fontSize="12"
                  textAnchor={x > size / 2 ? 'start' : 'end'}
                >
                  {t.symbol}
                </SvgText>
              </G>
            );
          })}

          {/* Área de valores */}
          <Polygon
            points={radarPoints.map(p => p.join(',')).join(' ')}
            fill="rgba(255,26,26,0.5)"
            stroke="#ff1a1a"
          />
        </G>
      </Svg>

      {/* Lista con botones “Ver detalle” */}
      {tokens.map((t, i) => (
        <TouchableOpacity
          key={i}
          style={styles.row}
          onPress={() => onSelect && onSelect(t)}
        >
          <Text style={styles.symbol}>{t.symbol}</Text>
          <Text style={styles.value}>{t.value.toLocaleString()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 6,
  },
  symbol: {
    color: '#fff',
  },
  value: {
    color: '#0f0',
  },
});

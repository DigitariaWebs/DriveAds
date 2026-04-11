import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { Card } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { drivers, Driver } from '../../../mocks/data';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../constants/theme';

interface AdminDriversTabProps {
  onLogout: () => void;
}

type Filter = 'all' | 'pending' | 'validated' | 'rejected';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'pending', label: 'En attente' },
  { key: 'validated', label: 'Validés' },
  { key: 'rejected', label: 'Rejetés' },
];

const statusBadge: Record<
  Driver['status'],
  { variant: 'success' | 'warning' | 'danger'; label: string }
> = {
  validated: { variant: 'success', label: 'Validé' },
  pending: { variant: 'warning', label: 'En attente' },
  rejected: { variant: 'danger', label: 'Rejeté' },
};

export function AdminDriversTab({ onLogout }: AdminDriversTabProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = drivers.filter((d) => {
    if (filter !== 'all' && d.status !== filter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        subtitle="Gestion"
        title="Chauffeurs"
        onLogoutPress={onLogout}
      />

      {/* Search */}
      <View style={{ paddingHorizontal: 24, marginBottom: 14 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            borderRadius: RADIUS.lg,
            paddingHorizontal: 14,
            height: 48,
            borderWidth: 1,
            borderColor: COLORS.gray100,
            ...SHADOWS.sm,
          }}
        >
          <Ionicons name="search" size={18} color={COLORS.gray400} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher un chauffeur..."
            placeholderTextColor={COLORS.gray400}
            style={{
              flex: 1,
              marginLeft: 10,
              fontFamily: FONTS.medium,
              fontSize: 14,
              color: COLORS.navy,
            }}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={{ paddingLeft: 24, marginBottom: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 24, gap: 8 }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const count =
              f.key === 'all'
                ? drivers.length
                : drivers.filter((d) => d.status === f.key).length;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.85}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  borderRadius: RADIUS.full,
                  backgroundColor: active ? COLORS.navy : COLORS.white,
                  borderWidth: 1,
                  borderColor: active ? COLORS.navy : COLORS.gray200,
                }}
              >
                <Text
                  style={{
                    fontFamily: active ? FONTS.bold : FONTS.medium,
                    fontSize: 13,
                    color: active ? COLORS.white : COLORS.gray600,
                  }}
                >
                  {f.label}
                </Text>
                <View
                  style={{
                    marginLeft: 6,
                    backgroundColor: active
                      ? 'rgba(255,255,255,0.2)'
                      : COLORS.gray100,
                    paddingHorizontal: 6,
                    minWidth: 20,
                    height: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 10,
                      color: active ? COLORS.white : COLORS.gray500,
                    }}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 120,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const sb = statusBadge[item.status];
          const initials = item.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2);
          return (
            <Card padding="lg">
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: COLORS.navySoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.black,
                      fontSize: 15,
                      color: COLORS.navy,
                    }}
                  >
                    {initials}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 14,
                      color: COLORS.navy,
                    }}
                  >
                    {item.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 2,
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={11}
                      color={COLORS.gray500}
                    />
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        fontSize: 11,
                        color: COLORS.gray500,
                        marginLeft: 3,
                      }}
                    >
                      {item.city}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 11,
                        color: COLORS.gray400,
                        marginHorizontal: 6,
                      }}
                    >
                      •
                    </Text>
                    <Ionicons
                      name="briefcase-outline"
                      size={11}
                      color={COLORS.gray500}
                    />
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        fontSize: 11,
                        color: COLORS.gray500,
                        marginLeft: 3,
                      }}
                    >
                      {item.campaignsDone} camp.
                    </Text>
                    {item.rating > 0 && (
                      <>
                        <Text
                          style={{
                            fontFamily: FONTS.regular,
                            fontSize: 11,
                            color: COLORS.gray400,
                            marginHorizontal: 6,
                          }}
                        >
                          •
                        </Text>
                        <Ionicons name="star" size={11} color={COLORS.warning} />
                        <Text
                          style={{
                            fontFamily: FONTS.medium,
                            fontSize: 11,
                            color: COLORS.gray500,
                            marginLeft: 3,
                          }}
                        >
                          {item.rating}
                        </Text>
                      </>
                    )}
                  </View>
                  <View style={{ marginTop: 6 }}>
                    <Badge variant={sb.variant}>{sb.label}</Badge>
                  </View>
                </View>
                {item.status === 'pending' ? (
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: COLORS.successSoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name="checkmark"
                        size={17}
                        color={COLORS.success}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: COLORS.dangerSoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="close" size={17} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={COLORS.gray300}
                  />
                )}
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}

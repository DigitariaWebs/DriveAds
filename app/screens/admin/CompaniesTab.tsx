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
import { IconCircle } from '../../../components/IconCircle';
import { companies, Company } from '../../../mocks/data';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../constants/theme';

interface AdminCompaniesTabProps {
  onLogout: () => void;
}

type Filter = 'all' | 'pending' | 'validated';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'En attente' },
  { key: 'validated', label: 'Validées' },
];

const statusBadge: Record<Company['status'], { variant: 'success' | 'warning'; label: string }> = {
  validated: { variant: 'success', label: 'Validée' },
  pending: { variant: 'warning', label: 'En attente' },
};

export function AdminCompaniesTab({ onLogout }: AdminCompaniesTabProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = companies.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        subtitle="Gestion"
        title="Entreprises"
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
            placeholder="Rechercher une entreprise..."
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
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.85}
                style={{
                  paddingHorizontal: 16,
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
          return (
            <Card padding="lg">
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconCircle icon={item.icon} size="lg" variant="soft" />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 15,
                      color: COLORS.navy,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.medium,
                      fontSize: 11,
                      color: COLORS.gray500,
                      marginTop: 2,
                    }}
                  >
                    {item.sector}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 4,
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
                      name="megaphone-outline"
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
                      {item.campaignsCount} campagnes
                    </Text>
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

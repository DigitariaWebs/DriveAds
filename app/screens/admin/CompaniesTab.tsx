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
import { BrandLogo } from '../../../components/BrandLogo';
import { companies, Company } from '../../../mocks/data';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../constants/theme';

interface AdminCompaniesTabProps {
  onLogout: () => void;
  onOpenCompany: (company: Company) => void;
}

type Filter = 'all' | 'pending' | 'validated';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'En attente' },
  { key: 'validated', label: 'Validées' },
];

const statusBadge: Record<
  Company['status'],
  { variant: 'success' | 'warning'; label: string }
> = {
  validated: { variant: 'success', label: 'Validée' },
  pending: { variant: 'warning', label: 'En attente' },
};

export function AdminCompaniesTab({
  onLogout,
  onOpenCompany,
}: AdminCompaniesTabProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = companies.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
      return false;
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
      <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            borderRadius: RADIUS.lg,
            paddingHorizontal: 12,
            height: 42,
            borderWidth: 1,
            borderColor: COLORS.gray100,
            ...SHADOWS.sm,
          }}
        >
          <Ionicons name="search" size={16} color={COLORS.gray400} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher une entreprise..."
            placeholderTextColor={COLORS.gray400}
            style={{
              flex: 1,
              marginLeft: 8,
              fontFamily: FONTS.medium,
              fontSize: 13,
              color: COLORS.navy,
            }}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={{ paddingLeft: 20, marginBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20, gap: 6 }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.85}
                style={{
                  paddingHorizontal: 13,
                  paddingVertical: 7,
                  borderRadius: RADIUS.full,
                  backgroundColor: active ? COLORS.navy : COLORS.white,
                  borderWidth: 1,
                  borderColor: active ? COLORS.navy : COLORS.gray200,
                }}
              >
                <Text
                  style={{
                    fontFamily: active ? FONTS.bold : FONTS.medium,
                    fontSize: 12,
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
          paddingHorizontal: 20,
          paddingBottom: 120,
          gap: 8,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const sb = statusBadge[item.status];
          return (
            <Card padding="md" onPress={() => onOpenCompany(item)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <BrandLogo
                  domain={item.domain}
                  name={item.name}
                  size="md"
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.bold,
                        fontSize: 13,
                        color: COLORS.navy,
                        flex: 1,
                        marginRight: 6,
                      }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Badge variant={sb.variant}>{sb.label}</Badge>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        fontSize: 10,
                        color: COLORS.gray500,
                      }}
                    >
                      {item.sector}
                    </Text>
                    <Text
                      style={{
                        marginHorizontal: 5,
                        color: COLORS.gray300,
                        fontSize: 10,
                      }}
                    >
                      •
                    </Text>
                    <Ionicons
                      name="location-outline"
                      size={10}
                      color={COLORS.gray500}
                    />
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        fontSize: 10,
                        color: COLORS.gray500,
                        marginLeft: 2,
                      }}
                    >
                      {item.city}
                    </Text>
                    <Text
                      style={{
                        marginHorizontal: 5,
                        color: COLORS.gray300,
                        fontSize: 10,
                      }}
                    >
                      •
                    </Text>
                    <Ionicons
                      name="megaphone-outline"
                      size={10}
                      color={COLORS.gray500}
                    />
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        fontSize: 10,
                        color: COLORS.gray500,
                        marginLeft: 2,
                      }}
                    >
                      {item.campaignsCount} camp.
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}

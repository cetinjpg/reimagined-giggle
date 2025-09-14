import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';

// GraphQL Client Configuration
const httpLink = new HttpLink({
  uri: 'https://api.habbo.com/graphql', // Habbo GraphQL endpoint (örnek)
  headers: {
    'Content-Type': 'application/json',
  }
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// GraphQL Queries
export const GET_ACTIVE_USERS = gql`
  query GetActiveUsers {
    activeUsers {
      id
      username
      avatar
      status
      lastSeen
      onlineTime
      rank
      badge
      motto
      room {
        name
        id
      }
    }
  }
`;

export const GET_USER_DETAILS = gql`
  query GetUserDetails($username: String!) {
    user(username: $username) {
      id
      username
      avatar
      status
      lastSeen
      onlineTime
      rank
      badge
      motto
      achievements
      friends {
        username
        status
      }
      room {
        name
        id
        users
      }
    }
  }
`;

// Mock Data (gerçek GraphQL endpoint olmadığı için)
export const mockActiveUsers = [
  {
    id: '1',
    username: 'zehroski',
    avatar: 'https://www.habbo.com/habbo-imaging/avatarimage?user=zehroski&action=std&direction=2&head_direction=3&img_format=png&gesture=std&headonly=0&size=b',
    status: 'online',
    lastSeen: new Date().toISOString(),
    onlineTime: 69,
    rank: 'Toh Cb genel sekreter bbc',
    badge: 'memurlar',
    motto: 'Durum: Aktif',
    room: {
      name: 'TÖH Genel Merkez',
      id: 'toh-merkez'
    }
  },
  {
    id: '2',
    username: 'nihat619',
    avatar: 'https://www.habbo.com/habbo-imaging/avatarimage?user=nihat619&action=std&direction=2&head_direction=3&img_format=png&gesture=std&headonly=0&size=b',
    status: 'online',
    lastSeen: new Date().toISOString(),
    onlineTime: 15,
    rank: 'TÖH Başbakan Asistanı ES67',
    badge: 'basbakan',
    motto: 'Durum: Aktif',
    room: {
      name: 'TÖH Başbakanlık',
      id: 'toh-basbakan'
    }
  },
  {
    id: '3',
    username: 'cerenvpie',
    avatar: 'https://www.habbo.com/habbo-imaging/avatarimage?user=cerenvpie&action=std&direction=2&head_direction=3&img_format=png&gesture=std&headonly=0&size=b',
    status: 'online',
    lastSeen: new Date().toISOString(),
    onlineTime: 15,
    rank: 'TÖH',
    badge: 'memurlar',
    motto: 'Durum: Aktif',
    room: {
      name: 'TÖH Lobi',
      id: 'toh-lobi'
    }
  },
  {
    id: '4',
    username: 'Tiramisuu',
    avatar: 'https://www.habbo.com/habbo-imaging/avatarimage?user=Tiramisuu&action=std&direction=2&head_direction=3&img_format=png&gesture=std&headonly=0&size=b',
    status: 'online',
    lastSeen: new Date().toISOString(),
    onlineTime: 61,
    rank: 'Toh Eş sahip morte',
    badge: 'kurucular',
    motto: 'Durum: Aktif',
    room: {
      name: 'TÖH VIP',
      id: 'toh-vip'
    }
  },
  {
    id: '5',
    username: '!Mehmet!',
    avatar: 'https://www.habbo.com/habbo-imaging/avatarimage?user=!Mehmet!&action=std&direction=2&head_direction=3&img_format=png&gesture=std&headonly=0&size=b',
    status: 'online',
    lastSeen: new Date().toISOString(),
    onlineTime: 70,
    rank: 'Toh Kıdemli Yönetici Pnr',
    badge: 'yonetim',
    motto: 'Durum: Aktif',
    room: {
      name: 'TÖH Yönetim',
      id: 'toh-yonetim'
    }
  },
  {
    id: '6',
    username: 'geregedan',
    avatar: 'https://www.habbo.com/habbo-imaging/avatarimage?user=geregedan&action=std&direction=2&head_direction=3&img_format=png&gesture=std&headonly=0&size=b',
    status: 'online',
    lastSeen: new Date().toISOString(),
    onlineTime: 70,
    rank: 'TÖH Şahsi geregedan',
    badge: 'liderler',
    motto: 'Durum: Aktif',
    room: {
      name: 'TÖH Operasyon',
      id: 'toh-operasyon'
    }
  }
];

export default client;
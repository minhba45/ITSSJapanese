import React, { useState, useEffect } from 'react';
import './RestaurantSearch.scss';

// Mock data
const mockRestaurants = [
  { id: 1, name: 'ハトヤマ', category: 'ラーメン', rating: 4.7, image: '🍜', price: '¥800-1200', distance: '500m', time: '15分', description: '伝統的な醤油ラーメンの名店' },
  { id: 2, name: '鐵吉ラーメン', category: 'ラーメン', rating: 4.3, image: '🍲', price: '¥700-1000', distance: '800m', time: '20分', description: '濃厚な豚骨スープが自慢' },
  { id: 3, name: '成辰町ラーメン', category: 'ラーメン', rating: 4.9, image: '🍜', price: '¥900-1500', distance: '1.2km', time: '25分', description: '海鮮ベースのあっさり系' },
  { id: 4, name: 'バインミー屋', category: 'バインミー', rating: 4.5, image: '🥖', price: '¥500-800', distance: '300m', time: '10分', description: '本場ベトナムの味' },
  { id: 5, name: '寿司天', category: '寿司', rating: 4.8, image: '🍣', price: '¥2000-4000', distance: '1.5km', time: '30分', description: '新鮮な魚介類を使用' },
  { id: 6, name: '天ぷら屋', category: '天ぷら', rating: 4.6, image: '🍤', price: '¥1500-3000', distance: '600m', time: '18分', description: 'サクサクの揚げたて天ぷら' },
  { id: 7, name: '焼肉王', category: '焼肉', rating: 4.4, image: '🥩', price: '¥3000-5000', distance: '900m', time: '22分', description: 'A5ランクの黒毛和牛' },
  { id: 8, name: 'カレーハウス', category: 'カレー', rating: 4.2, image: '🍛', price: '¥600-900', distance: '400m', time: '12分', description: 'スパイシーな本格カレー' },
];

const recentKeywords = ['バインミー', '寿司', 'ラーメン', '天ぷら'];

const RestaurantSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [filterCategory, setFilterCategory] = useState('all');

  // Auto-search khi người dùng nhập
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        performSearch(searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setFilteredResults([]);
      setIsSearching(false);
    }
  }, [searchTerm, sortBy, filterCategory]);

  const performSearch = (term) => {
    let results = mockRestaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(term.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(term.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(term.toLowerCase())
    );

    // Apply category filter
    if (filterCategory !== 'all') {
      results = results.filter(r => r.category === filterCategory);
    }

    // Apply sorting
    results.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === 'price') return parseFloat(a.price.split('-')[0].replace('¥', '')) - parseFloat(b.price.split('-')[0].replace('¥', ''));
      return 0;
    });

    setFilteredResults(results);
  };

  const handleKeywordClick = (keyword) => {
    setSearchTerm(keyword);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredResults([]);
    setIsSearching(false);
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const closeDetail = () => {
    setSelectedRestaurant(null);
  };

  const categories = ['all', ...new Set(mockRestaurants.map(r => r.category))];

  // Detail View
  if (selectedRestaurant) {
    return (
      <div className="restaurant-detail">
        <div className="detail-header">
          <button className="back-button" onClick={closeDetail}>
            <ArrowLeft size={24} />
          </button>
          <h2>詳細情報</h2>
        </div>
        <div className="detail-content">
          <div className="detail-image">{selectedRestaurant.image}</div>
          <h1 className="detail-name">{selectedRestaurant.name}</h1>
          <div className="detail-rating">
            <Star size={20} fill="#FFD700" stroke="#FFD700" />
            <span>{selectedRestaurant.rating}</span>
          </div>
          <div className="detail-info">
            <div className="info-item">
              <MapPin size={18} />
              <span>{selectedRestaurant.distance}</span>
            </div>
            <div className="info-item">
              <Clock size={18} />
              <span>{selectedRestaurant.time}</span>
            </div>
            <div className="info-item">
              <span className="price">{selectedRestaurant.price}</span>
            </div>
          </div>
          <div className="detail-category">{selectedRestaurant.category}</div>
          <p className="detail-description">{selectedRestaurant.description}</p>
          <button className="reserve-button">予約する</button>
        </div>
      </div>
    );
  }

  // Main Search View
  return (
    <div className="restaurant-search">
      <div className="search-header">
        <h1 className="page-title">検索</h1>
        
        <div className="search-bar">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="ラーメン"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-button" onClick={clearSearch}>
                <X size={18} />
              </button>
            )}
          </div>
          <button 
            className={`filter-button ${showFilter ? 'active' : ''}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {showFilter && (
          <div className="filter-panel">
            <div className="filter-section">
              <label>並び替え:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="rating">評価順</option>
                <option value="distance">距離順</option>
                <option value="price">価格順</option>
              </select>
            </div>
            <div className="filter-section">
              <label>カテゴリ:</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'すべて' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {!isSearching && (
          <div className="recent-keywords">
            <h3 className="section-title">最近のキーワード</h3>
            <div className="keyword-chips">
              {recentKeywords.map((keyword, index) => (
                <button
                  key={index}
                  className="keyword-chip"
                  onClick={() => handleKeywordClick(keyword)}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="search-results">
        {isSearching ? (
          <>
            {filteredResults.length > 0 ? (
              <>
                <h3 className="section-title">
                  検索結果 ({filteredResults.length}件)
                </h3>
                <div className="restaurant-list">
                  {filteredResults.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="restaurant-card"
                      onClick={() => handleRestaurantClick(restaurant)}
                    >
                      <div className="restaurant-image">{restaurant.image}</div>
                      <div className="restaurant-info">
                        <h4 className="restaurant-name">{restaurant.name}</h4>
                        <div className="restaurant-meta">
                          <div className="rating">
                            <Star size={14} fill="#FFD700" stroke="#FFD700" />
                            <span>{restaurant.rating}</span>
                          </div>
                          <span className="category">{restaurant.category}</span>
                        </div>
                        <div className="restaurant-details">
                          <span className="distance">{restaurant.distance}</span>
                          <span className="separator">•</span>
                          <span className="time">{restaurant.time}</span>
                          <span className="separator">•</span>
                          <span className="price">{restaurant.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>結果が見つかりませんでした</h3>
                <p>別のキーワードで検索してみてください</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="section-title">おすすめのレストラン</h3>
            <div className="restaurant-list">
              {mockRestaurants.slice(0, 3).map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="restaurant-card"
                  onClick={() => handleRestaurantClick(restaurant)}
                >
                  <div className="restaurant-image">{restaurant.image}</div>
                  <div className="restaurant-info">
                    <h4 className="restaurant-name">{restaurant.name}</h4>
                    <div className="restaurant-meta">
                      <div className="rating">
                        <Star size={14} fill="#FFD700" stroke="#FFD700" />
                        <span>{restaurant.rating}</span>
                      </div>
                      <span className="category">{restaurant.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="section-title">おすすめの料理</h3>
            <div className="dish-grid">
              {mockRestaurants.slice(3, 7).map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="dish-card"
                  onClick={() => handleRestaurantClick(restaurant)}
                >
                  <div className="dish-image">{restaurant.image}</div>
                  <div className="dish-name">{restaurant.category}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantSearch;
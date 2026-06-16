# OPhim API reference

Nguồn tổng hợp cho dự án này được rút ra từ:
- `https://ophim17.cc/api-document`
- response thật từ `https://ophim1.com/v1/api/home`
- response thật từ `https://ophim1.com/v1/api/the-loai`
- response thật từ `https://ophim1.com/v1/api/phim/:slug`

## Base configuration đang dùng trong app

File hiện tại: `src/api/ophim.js`

- Base API: `https://ophim1.com/v1/api`
- Image CDN: `https://img.ophim.live/uploads/movies/`
- Method: `GET`
- Encoding: `UTF-8`
- Format: `JSON`

## Các endpoint đang dùng trong dự án

### 1. Trang chủ

- Endpoint: `GET /home`
- Hàm hiện tại: `getHome()`
- Response shape chính:

```json
{
  "status": "success",
  "message": "",
  "data": {
    "seoOnPage": {},
    "items": [
      {
        "_id": "...",
        "name": "Hoàng Tử Quỷ",
        "slug": "hoang-tu-quy",
        "origin_name": "The Demon Prince",
        "type": "single",
        "thumb_url": "hoang-tu-quy-thumb.jpg",
        "episode_current": "Full",
        "quality": "HD",
        "lang": "Vietsub",
        "year": 2025,
        "category": [{ "name": "Kinh Dị", "slug": "kinh-di" }],
        "country": [{ "name": "Việt Nam", "slug": "viet-nam" }]
      }
    ],
    "params": {
      "pagination": {
        "totalItems": 35874,
        "totalItemsPerPage": 24,
        "currentPage": 1,
        "pageRanges": 5
      }
    },
    "type_list": "phim-moi",
    "APP_DOMAIN_CDN_IMAGE": "https://img.ophim.live"
  }
}
```

### 2. Danh sách phim theo loại

- Endpoint: `GET /danh-sach/:slug?page=1&limit=24`
- Hàm hiện tại: `getMovieList(slug, page, limit)`
- Các slug hiện app đang map sẵn:
  - `phim-moi`
  - `phim-bo`
  - `phim-le`
  - `tv-shows`
  - `hoat-hinh`

### 3. Tìm kiếm phim

- Endpoint: `GET /tim-kiem?keyword=...&page=1&limit=24`
- Hàm hiện tại: `searchMovies(keyword, page, limit)`
- Lưu ý:
  - app hiện dùng query param tên `keyword`
  - response thực tế có cùng kiểu list response với `items`

### 4. Chi tiết phim

- Endpoint: `GET /phim/:slug`
- Hàm hiện tại: `getMovieDetail(slug)`
- Response shape chính:

```json
{
  "status": "success",
  "message": "",
  "data": {
    "seoOnPage": {},
    "breadCrumb": [],
    "params": { "slug": "one-piece-film-red" },
    "item": {
      "_id": "62de6c802d8263cfd10a2d48",
      "name": "ONE PIECE FILM: RED",
      "origin_name": "One Piece Movie 15",
      "slug": "one-piece-film-red",
      "content": "...",
      "status": "completed",
      "thumb_url": "one-piece-film-red-thumb.jpg",
      "poster_url": "one-piece-film-red-poster.jpg",
      "trailer_url": "https://www.youtube.com/watch?v=QM8T14BCR6o",
      "time": "116 phút",
      "episode_current": "Full",
      "episode_total": "1",
      "quality": "FHD",
      "lang": "Vietsub + Thuyết Minh",
      "year": 2022,
      "category": [{ "name": "Phiêu Lưu", "slug": "phieu-luu" }],
      "country": [{ "name": "Nhật Bản", "slug": "nhat-ban" }],
      "episodes": [
        {
          "server_name": "Vietsub #1",
          "is_ai": false,
          "server_data": [
            {
              "name": "Full",
              "slug": "full",
              "filename": "One.Piece.Film.Red...",
              "link_embed": "https://vip.opstream14.com/share/...",
              "link_m3u8": "https://vip.opstream14.com/.../index.m3u8"
            }
          ]
        }
      ]
    },
    "APP_DOMAIN_CDN_IMAGE": "https://img.ophim.live"
  }
}
```

### 5. Thể loại

- Endpoint: `GET /the-loai`
- Hàm hiện tại: `getGenres()`
- Response shape:

```json
{
  "status": "success",
  "message": "",
  "data": {
    "items": [
      { "_id": "620a21b2e0fc277084dfd0c5", "name": "Hành Động", "slug": "hanh-dong" }
    ]
  }
}
```

### 6. Phim theo thể loại

- Endpoint: `GET /the-loai/:slug?page=1&limit=24`
- Hàm hiện tại: `getMoviesByGenre(slug, page, limit)`
- Response cùng họ với list response.

### 7. Quốc gia

- Endpoint: `GET /quoc-gia`
- Hàm hiện tại: `getCountries()`
- Response cùng shape với `/the-loai`.

### 8. Phim theo quốc gia

- Endpoint: `GET /quoc-gia/:slug?page=1&limit=24`
- Hàm hiện tại: `getMoviesByCountry(slug, page, limit)`

### 9. Năm phát hành

- Endpoint: `GET /nam-phat-hanh`
- Hàm hiện tại: `getYears()`
- Dự kiến trả về `data.items`, nhưng nên luôn log/kiểm chứng khi OPhim thay đổi cấu trúc.

### 10. Phim theo năm phát hành

- Endpoint: `GET /nam-phat-hanh/:year?page=1&limit=24`
- Hàm hiện tại: `getMoviesByYear(year, page, limit)`

## Những field quan trọng nên ưu tiên khi code UI

### Movie summary

Các màn hình list/card hiện chủ yếu cần:
- `_id`
- `name`
- `origin_name`
- `slug`
- `thumb_url`
- `poster_url`
- `episode_current`
- `quality`
- `lang`
- `year`
- `category[]`
- `country[]`

### Movie detail

Trang detail/player cần thêm:
- `content`
- `trailer_url`
- `time`
- `episode_total`
- `status`
- `view`
- `actor[]`
- `director[]`
- `episodes[]`

### Episode structure

```json
{
  "server_name": "Vietsub #1",
  "is_ai": false,
  "server_data": [
    {
      "name": "Tập 1",
      "slug": "tap-1",
      "filename": "...",
      "link_embed": "https://...",
      "link_m3u8": "https://...m3u8"
    }
  ]
}
```

## Quy ước dùng trong dự án này

### Build image URL

`thumb_url` và `poster_url` thường là path tương đối. Khi render ảnh, dùng helper `buildImageUrl()` trong `src/api/ophim.js`.

Ví dụ:

```js
const thumb = buildImageUrl(movie.thumb_url || movie.poster_url);
```

### Xử lý fallback dữ liệu

OPhim có lúc trả field trống, `undefined`, hoặc mảng chứa chuỗi rỗng. Vì vậy khi code UI:
- luôn fallback cho ảnh
- không assume `actor[0]` hay `director[0]` luôn có dữ liệu
- kiểm tra `episodes?.length` trước khi render player
- kiểm tra `link_m3u8` trước khi khởi tạo HLS

## Nơi tra type nội bộ

Type nội bộ cho JavaScript nằm ở:
- `src/api/ophim.types.js`

File này dùng JSDoc typedef để sau này có thể:
- thêm autocomplete tốt hơn
- annotate hàm API hiện có
- dần migrate sang TypeScript nếu cần

## Gợi ý bước tiếp theo

Nếu muốn tận dụng tài liệu này tốt hơn, bước tiếp theo hợp lý là:
1. thêm JSDoc return type cho từng hàm trong `src/api/ophim.js`
2. chuẩn hóa response parsing trong một chỗ
3. thêm runtime guards nhẹ cho `data.items` và `data.item`

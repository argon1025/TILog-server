USE TILog;
alter database TILog default character set utf8 collate utf8_general_ci;

-- category Table Create SQL
CREATE TABLE category
(
    `id`            INT UNSIGNED    NOT NULL    AUTO_INCREMENT COMMENT '카테고리 아이디', 
    `categoryName`  VARCHAR(30)     NOT NULL    COMMENT '카테고리 명', 
    `iconURL`       VARCHAR(300)    NULL        COMMENT '커스텀 기술아이콘 컬럼', 
    CONSTRAINT PK_category PRIMARY KEY (id)
);

ALTER TABLE category COMMENT '카테고리 테이블';


-- users Table Create SQL
CREATE TABLE users
(
    `id`               INT UNSIGNED    NOT NULL    AUTO_INCREMENT COMMENT '데이터 베이스 유저 PK', 
    `oAuthType`        VARCHAR(10)     NOT NULL    COMMENT 'Oauth 로그인 타입 구분', 
    `oAuthServiceID`   VARCHAR(50)     NOT NULL    COMMENT 'Oauth 서비스 별 고유 유저 아이디', 
    `userName`         VARCHAR(50)     NOT NULL    DEFAULT 'User' COMMENT '서비스 유저 닉네임', 
    `proFileImageURL`  VARCHAR(300)    NULL        COMMENT '서비스 유저 프로필 이미지 링크', 
    `mailAddress`      VARCHAR(50)     NULL        COMMENT '서비스 메일 주소', 
    `password`         VARCHAR(50)     NULL        COMMENT '사용자 암호, Oauth 사용자는 NULL', 
    `accessToken`         VARCHAR(255)   NOT  NULL        COMMENT '서비스 엑세스 토큰', 
    `refreshToken`         VARCHAR(255)   NULL        COMMENT '서비스 리프레시 토큰', 
    `createdAt`        DATETIME        NOT NULL    COMMENT '유저 가입일', 
    `updatedAt`        DATETIME        NOT NULL    COMMENT '유저 갱신일', 
    `deletedAt`        DATETIME        NOT NULL    COMMENT '유저 삭제일', 
    `admin`            TINYINT         NOT NULL    DEFAULT 0 COMMENT '관리자 유무', 
    CONSTRAINT PK_users PRIMARY KEY (id)
);

ALTER TABLE users COMMENT '유저테이블';


-- pinnedRepositories Table Create SQL
CREATE TABLE pinnedRepositories
(
    `id`              INT UNSIGNED    NOT NULL    AUTO_INCREMENT COMMENT '핀된 레포 아이디', 
    `nodeID`          VARCHAR(30)     NOT NULL    COMMENT '레포지토리 UID', 
    `processPercent`  TINYINT         NOT NULL    DEFAULT 0 COMMENT '프로젝트 진행도', 
    `demoURL`         VARCHAR(300)    NULL        COMMENT '프로젝트 데모페이지', 
    `position`        VARCHAR(10)     NULL        COMMENT '프로젝트  역할', 
    CONSTRAINT PK_pinnedRepositories PRIMARY KEY (id)
);

ALTER TABLE pinnedRepositories COMMENT 'Pinned 레포 추가 정보 입력 카테고리';


-- posts Table Create SQL
CREATE TABLE posts
(
    `id`               BIGINT          NOT NULL    AUTO_INCREMENT COMMENT '포스트 아이디', 
    `usersID`          INT UNSIGNED    NOT NULL    COMMENT '유저 아이디', 
    `categoryID`       INT UNSIGNED    NOT NULL    COMMENT '카테고리 아이디', 
    `title`            VARCHAR(50)     NOT NULL    COMMENT '게시글 제목', 
    `thumbNailURL`    VARCHAR(300)    NULL        COMMENT '썸네일 이미지 URL', 
    `viewCounts`       INT UNSIGNED    NOT NULL    DEFAULT 0 COMMENT '조회수', 
    `likes`             INT UNSIGNED    NOT NULL    DEFAULT 0 COMMENT '좋아요', 
    `markDownContent`  MEDIUMTEXT      NULL        COMMENT '마크 다운 형식의 본문', 
    `private`          TINYINT         NOT NULL    DEFAULT 0 COMMENT '비밀글 여부', 
    `createdAt`        DATETIME        NOT NULL    COMMENT '게시글 최초 작성일', 
    `updatedAt`        DATETIME        NULL        COMMENT '게시글 마지막 업데이트일', 
    `deletedAt`        DATETIME        NULL        COMMENT '게시글 삭제일', 
    CONSTRAINT PK_posts PRIMARY KEY (id)
);

ALTER TABLE posts COMMENT '포스트';

-- 외래키 제약 설정
ALTER TABLE posts
    ADD CONSTRAINT FK_posts_usersID_users_id FOREIGN KEY (usersID)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 외래키 제약 설정
ALTER TABLE posts
    ADD CONSTRAINT FK_posts_categoryID_category_id FOREIGN KEY (categoryID)
        REFERENCES category (id) ON DELETE CASCADE ON UPDATE CASCADE;


-- tags Table Create SQL
CREATE TABLE tags
(
    `id`         BIGINT         NOT NULL    AUTO_INCREMENT COMMENT '태그 PK', 
    `tagsName`   VARCHAR(30)    NOT NULL    COMMENT '태그 명', 
    `createdAt`  DATETIME       NOT NULL    COMMENT '태그 생성일자', 
    CONSTRAINT PK_tags PRIMARY KEY (id)
);

ALTER TABLE tags COMMENT '태그 테이블';


-- userblogCustomization Table Create SQL
CREATE TABLE userblogCustomization
(
    `usersID`           INT UNSIGNED    NOT NULL    COMMENT '유저 아이디', 
    `blogTitle`         VARCHAR(20)     NULL        COMMENT '블로그 타이틀', 
    `statusMessage`     VARCHAR(30)     NULL        COMMENT '상태메시지', 
    `selfIntroduction`  VARCHAR(300)    NULL        COMMENT '자기소개', 
    CONSTRAINT PK_userblogCustomization PRIMARY KEY (usersID)
);

ALTER TABLE userblogCustomization COMMENT '유저블로그커스터마이제이션';

-- 외래키 제약 설정
ALTER TABLE userblogCustomization
    ADD CONSTRAINT FK_userblogCustomization_usersID_users_id FOREIGN KEY (usersID)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE;


-- pinnedRepositoryCategories Table Create SQL
CREATE TABLE pinnedRepositoryCategories
(
    `id`                    INT UNSIGNED    NOT NULL    AUTO_INCREMENT COMMENT '핀된 레포 카테고리 아이디', 
    `categoryID`            INT UNSIGNED    NOT NULL        COMMENT '핀 카테고리 관계설정 PK', 
    `pinnedRepositoriesID`  INT UNSIGNED    NOT NULL        COMMENT '핀된 레포 아이디', 
    CONSTRAINT PK_pinnedRepositoryCategories PRIMARY KEY (id)
);

ALTER TABLE pinnedRepositoryCategories COMMENT 'Pinned 레포에 관한 기술 카테고리 관계 설정 테이블';

-- 외래키 제약 설정
ALTER TABLE pinnedRepositoryCategories
    ADD CONSTRAINT FK_pinnedRepositoryCategories_pinnedRepositoriesID_pinnedReposit FOREIGN KEY (pinnedRepositoriesID)
        REFERENCES pinnedRepositories (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 외래키 제약 설정
ALTER TABLE pinnedRepositoryCategories
    ADD CONSTRAINT FK_pinnedRepositoryCategories_categoryID_category_id FOREIGN KEY (categoryID)
        REFERENCES category (id) ON DELETE CASCADE ON UPDATE CASCADE;


-- comments Table Create SQL
CREATE TABLE comments
(
    `id`           BIGINT          NOT NULL    AUTO_INCREMENT COMMENT '코멘트 아이디', 
    `usersID`      INT UNSIGNED    NOT NULL    COMMENT '유저 아이디', 
    `postsID`      BIGINT          NOT NULL    COMMENT '포스트 아이디', 
    `htmlContent`  VARCHAR(300)    NOT NULL    COMMENT '코멘트', 
    `replyTo`      BIGINT          NULL        COMMENT '답글 PK, 아닐경우 NULL', 
    `replyLevel`   TINYINT         NOT NULL    DEFAULT 0 COMMENT '루트 코멘트 판별 0,1', 
    `createdAt`    DATETIME        NOT NULL    COMMENT '코멘트 생성일', 
    `updatedAt`    DATETIME        NULL        COMMENT '코멘트 수정일', 
    `deletedAt`    DATETIME        NULL        COMMENT '코멘트 삭제일', 
    CONSTRAINT PK_comments PRIMARY KEY (id)
);

ALTER TABLE comments COMMENT '코멘트';

-- 외래키 제약 설정
ALTER TABLE comments
    ADD CONSTRAINT FK_comments_usersID_users_id FOREIGN KEY (usersID)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 외래키 제약 설정
ALTER TABLE comments
    ADD CONSTRAINT FK_comments_postsID_posts_id FOREIGN KEY (postsID)
        REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE;


-- imageUpload Table Create SQL
CREATE TABLE imageUpload
(
    `id`             BIGINT          NOT NULL        AUTO_INCREMENT COMMENT '이미지 업로드 아이디', 
    `usersID`        INT UNSIGNED    NULL    COMMENT '유저 아이디', 
    `pathUrl`        VARCHAR(300)    NOT NULL    COMMENT '이미지 URL 정보', 
    `fileSizeBytes`  INT             NOT NULL    COMMENT '파일 사이즈 정보', 
    `fileType`       VARCHAR(20)     NOT NULL    COMMENT '파일 타입 정보', 
    `createdAt`      DATETIME        NOT NULL    COMMENT '파일 업로드일', 
    CONSTRAINT PK_imageUpload PRIMARY KEY (id)
);

ALTER TABLE imageUpload COMMENT '이미지 업로드';

-- 외래키 제약 설정
ALTER TABLE imageUpload
    ADD CONSTRAINT FK_imageUpload_usersID_users_id FOREIGN KEY (usersID)
        REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE;


-- postsTags Table Create SQL
CREATE TABLE postsTags
(
    `id`         BIGINT      NOT NULL    AUTO_INCREMENT COMMENT '포스트태그 관계 PK', 
    `postsID`    BIGINT      NOT NULL    COMMENT '포스트 아이디', 
    `tagsID`     BIGINT      NOT NULL    COMMENT '태그 아이디', 
    `createdAt`  DATETIME    NOT NULL    COMMENT '포스트 테그 생성일', 
    CONSTRAINT PK_postsTags PRIMARY KEY (id)
);

ALTER TABLE postsTags COMMENT '포스트 태그 관계 설정 테이블';

-- 외래키 제약 설정
ALTER TABLE postsTags
    ADD CONSTRAINT FK_postsTags_postsID_posts_id FOREIGN KEY (postsID)
        REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 외래키 제약 설정
ALTER TABLE postsTags
    ADD CONSTRAINT FK_postsTags_tagsID_tags_id FOREIGN KEY (tagsID)
        REFERENCES tags (id) ON DELETE CASCADE ON UPDATE CASCADE;


-- postLike Table Create SQL
CREATE TABLE postLike
(
    `id`       BIGINT          NOT NULL    AUTO_INCREMENT COMMENT '포스트좋아요 아이디', 
    `usersID`  INT UNSIGNED    NOT NULL    COMMENT '유저 아이디', 
    `postsID`  BIGINT          NOT NULL    COMMENT '포스트 아이디', 
    `likedAt`  DATETIME        NOT NULL    COMMENT '좋아요 누른일', 
    CONSTRAINT PK_postLike PRIMARY KEY (id)
);

ALTER TABLE postLike COMMENT '좋아요 테이블';

-- 외래키 제약 설정
ALTER TABLE postLike
    ADD CONSTRAINT FK_postLike_postsID_posts_id FOREIGN KEY (postsID)
        REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 외래키 제약 설정
ALTER TABLE postLike
    ADD CONSTRAINT FK_postLike_usersID_users_id FOREIGN KEY (usersID)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- postView Table Create SQL
CREATE TABLE postView
(
    `id`       BIGINT          NOT NULL    AUTO_INCREMENT COMMENT '포스트좋아요 아이디', 
    `userIP`  VARCHAR(16)    NOT NULL    COMMENT '유저 아이피', 
    `postsID`  BIGINT          NOT NULL    COMMENT '포스트 아이디', 
    `viewedAt`  DATETIME        NOT NULL    COMMENT '포스트 열람일', 
    CONSTRAINT PK_postView PRIMARY KEY (id)
);

ALTER TABLE postView COMMENT '포스트 뷰 테이블';

-- 외래키 제약 설정
ALTER TABLE postView
    ADD CONSTRAINT FK_postView_postsID_posts_id FOREIGN KEY (postsID)
        REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE;
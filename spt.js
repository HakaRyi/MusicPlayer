const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playBtn = $('.btn-play')
const pauseBtn = $('.btn-pause')
const repeatBtn = $('.btn-repeat')
const progress = $('.progress-bar')
const next = $('.btn-next')
const song = $('.listen')
const previous = $('.btn-previous')
const random = $('.btn-mode')
const cd = $('.picture-container')
const playList = $('.music-list')
const interface = $('.music-interface')
const heading = $('.music-name')
const img = $('.music-picture')
const audio = $('#audio')

const app = {
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    songs:[
        {
            name: 'Để tôi ôm em bằng giai điệu này',
            singer: 'Min',
            path: './assest/songs/DeToiOmEmBangGiaiDieuNay-KaiDinhMINGREYD.mp3',
            image: './assest/imgs/Hay_De_Toi_Om_Em_Bang_Giai_Dieu_Nay.jpg'
        },
        {
            name: '1 Ngày Buồn',
            singer: 'Thuỳ Chi',
            path: './assest/songs/MT NGAY BUN KIU CHI (tainhactop.vip).mp3',
            image: './assest/imgs/1_Ngay_Buon.jpg'
        },
        {
            name: '11 Giờ 11 Phút',
            singer: 'MiiNa',
            path: './assest/songs/11Gio11Phut.mp3',
            image: './assest/imgs/11Gio11Phut.jpg'
        },
        {
            name: 'Bầu Trời Mới',
            singer: 'DaLab',
            path: './assest/songs/BauTroiMoi.mp3',
            image: './assest/imgs/BauTroiMoi.jpg'
        },
        {
            name: 'Vì Em Chưa Bao Giờ Khóc',
            singer: 'Hà Nhi',
            path: './assest/songs/ViEmChuaBaoGioKhoc.mp3',
            image: './assest/imgs/ViEmChuaBaoGioKhoc.jpg'
        }
],
    render:function(){
        const html = this.songs.map((song,index) => {
            return `
            <div class="song-container">
                <div class="song ${index === this.currentIndex ? 'listen' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url(${song.image}); width: 120px; height: 120px; background-size: cover;"></div>
                    <div class="body">
                        <h4 class="title">${song.name}</h4>
                        <p class="author">
                        ${song.singer}
                        </p>
                    </div>
                    <div class="option">
                        <span class="glyphicon glyphicon-option-horizontal"></span>
                    </div>
                </div>
            </div>
            `
        })
        playList.innerHTML = html.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    }
        ,
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        img.style.backgroundImage = `url('${this.currentSong.image}')`
        interface.style.backgroundImage=`url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    handleEvent: function(){
        const _this = this
            //xoay music picture
        const cdThumb=img.animate([
                { transform: 'rotate(0deg)', borderColor: 'skyblue' }, 
                { transform: 'rotate(180deg)', borderColor: '#ff4d4f' }, 
                { transform: 'rotate(360deg)', borderColor: 'skyblue'}
            ],{
                duration: 10000,
                iterations: Infinity
                })
            //Zoom Picture
            let cdWidth = cd.offsetWidth
            document.onscroll = function(){
                const scrolltop = window.scrollY
                const newCdWidth = cdWidth - scrolltop

                cd.style.width = newCdWidth>0 ? newCdWidth + 'px': 0 
                cd.style.opacity = newCdWidth / cdWidth
            }
        cdThumb.pause();
        audio.onplaying = function(){
            cdThumb.play()
            pauseBtn.classList.add('playing')
            playBtn.classList.remove('playing')
            
        }

        random.onclick = function(){
            _this.isRandom = !_this.isRandom
            random.classList.toggle('active', _this.isRandom);
        }
        

        playBtn.onclick = function(){
            audio.play()
            this.classList.remove('playing')
            pauseBtn.classList.add('playing')
            cdThumb.play();
        }

        pauseBtn.onclick = function(){
            audio.pause()
            this.classList.remove('playing')
            playBtn.classList.add('playing')
            cdThumb.pause();
        }

        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPer = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPer
            }
        }

        progress.oninput = function(e){
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }


        next.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
            _this.nextSong()
            }
            audio.play();
        }

        previous.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
            _this.previousSong()
            }
            audio.play();
        }

        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else if(_this.isRandom){
                _this.playRandomSong()
            }else{
            _this.nextSong()
            }
            audio.play()
        }

        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //Chọn bài hát
        playList.onclick = function(e){
            const selectedSong = e.target.closest('.song:not(.listen)')
            if(selectedSong || e.target.closest('.option')){
                if(selectedSong){
                    _this.currentIndex = Number(selectedSong.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
        
        
},nextSong: function(){
        this.currentIndex++
        if(this.currentIndex>=this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.render()
        this.scrollToView();
},previousSong: function(){
        this.currentIndex--
        if(this.currentIndex<0){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
        this.render()
        this.scrollToView();
},playRandomSong: function(){
        let newIndex 
        do{
        newIndex=Math.floor(Math.random()*this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
        this.render()
        this.scrollToView();
},scrollToView: function scrollToView() 
        {
            let playingSong = $('.song.listen')
            const first3song = [0,1]
            console.log(playingSong)
            const fixElementHeight = $('.music-interface').offsetHeight
            const rect = playingSong.getBoundingClientRect(); 
            const isInViewport = ( 
                rect.top >= fixElementHeight 
                && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) )
            if (!isInViewport){
                    if(first3song.includes(Number(playingSong.dataset.index))){
                    setTimeout(()=>{
                        playingSong.scrollIntoView({ behavior: "smooth", block: "center" });
                        console.log(playingSong.dataset.index)
                    }, 400)
                    
                }else{
                    setTimeout(()=>{
                        playingSong.scrollIntoView({ behavior: "smooth", block: "nearest" }); 
                    }, 400)
                }
            }
        }
,
    start: function(){
        this.defineProperties();
        this.loadCurrentSong();
        this.handleEvent();
        this.render();
    }
}

app.start();
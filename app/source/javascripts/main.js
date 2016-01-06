window.onload = function () {
    // ��������
    var $ = jQuery = require('jquery');
    var Swiper = require('swiper');
    var move = require('move-js');
    var animationControl = require('./animation-control.js');

    // ��ȡ��������DOM
    var bgMusic = $('audio').get(0);

    // �������ֿ��ư�ť
    $('.btn-music').click(function () {
        if (bgMusic.paused) {
            bgMusic.play();
            $(this).removeClass('paused');
        } else {
            bgMusic.pause();
            $(this).addClass('paused');
        }
    });

    // ��ʼ��Swiperʵ��
    new Swiper('.swiper-container', {
        direction: 'vertical',
        onInit: function (swiper) {
            animationControl.initAnimationItems();  // ��ʼ������Ԫ��
            animationControl.execAnimation(swiper); // ִ�е�һ��slide�Ķ���
        },
        onSlideChangeStart: function (swiper) {     // �����������һ��slideʱ������.btn-swipe
            if (swiper.activeIndex === swiper.slides.length - 1) {
                $('.btn-swipe').hide();
            } else {
                $('.btn-swipe').show();
            }
        },
        onSlideChangeEnd: function (swiper) {       // ִ�е�ǰslide�Ķ���
            animationControl.execAnimation(swiper);
        },
        onTouchStart: function (swiper, event) {    // �����ƶ����������֧��audio���Զ����ţ���˱������ֵĲ�����Ҫ���û������Ļ�󴥷�
            bgMusic.play();
        }
    });

    // ҳ����ɼ��غ����ؼ��ض���
    $('.loading-overlay').slideUp();
};

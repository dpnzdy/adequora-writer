"""Browser QA for the static site. Requires an existing Playwright + Edge installation."""
from pathlib import Path
import hashlib,json
import subprocess
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
QA=ROOT/'.qa'
QA.mkdir(exist_ok=True)
BASE='http://127.0.0.1:4173/'
reports=[]
settings=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {config} from './src/config.mjs'; console.log(JSON.stringify(config))"],cwd=ROOT,encoding='utf-8'))
with sync_playwright() as p:
    browser=p.chromium.launch(channel='msedge',headless=True)
    context=browser.new_context(viewport={'width':1440,'height':1000},device_scale_factor=1,accept_downloads=True)
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    names=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {pages} from './src/pages.mjs'; console.log(JSON.stringify(pages.map(p=>p.id)))"],cwd=ROOT,encoding='utf-8'))
    for name in names:
        response=page.goto(BASE+name+'.html',wait_until='networkidle')
        assert response.status==200
        assert page.locator('h1').count()==1
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),name
        page.locator('img').evaluate_all('(images)=>images.forEach(i=>i.loading="eager")')
        page.wait_for_function('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
        page.screenshot(path=str(QA/(name+'-desktop.png')),full_page=True)
        if name=='index':page.screenshot(path=str(QA/'home-cover.png'))
        for width in [390,320,768]:
            page.set_viewport_size({'width':width,'height':844})
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'{name}: overflow at {width}'
            if width==390:page.screenshot(path=str(QA/(name+'-mobile.png')),full_page=True)
        reports.append({'page':name,'status':200,'responsiveWidths':[1440,768,390,320]})
        page.set_viewport_size({'width':1440,'height':1000})

    page.goto(BASE,wait_until='networkidle')
    page.get_by_role('tab',name='학습 기록').click()
    assert page.locator('[data-demo-title]').inner_text()=='오늘 배운 작은 발견'
    assert page.get_by_role('tabpanel',name='학습 기록').is_visible()
    page.get_by_role('tab',name='학습 기록').press('ArrowLeft')
    assert page.get_by_role('tab',name='아이디어 노트').get_attribute('aria-selected')=='true'
    page.get_by_role('tab',name='오디오',exact=True).click()
    assert page.locator('#panel-audio').is_visible()
    assert not page.locator('#panel-image').is_visible()
    page.locator('#panel-audio audio').evaluate('(m)=>{m.muted=true;return m.play()}')
    page.wait_for_function('document.querySelector("#panel-audio audio").currentTime>0')
    page.get_by_role('tab',name='비디오',exact=True).click()
    assert page.locator('#panel-audio audio').evaluate('(m)=>m.paused')
    video=page.locator('#panel-video video')
    video.evaluate('(m)=>{m.muted=true;return m.play()}')
    page.wait_for_function('document.querySelector("#panel-video video").currentTime>0')
    page.get_by_role('tab',name='이미지',exact=True).click()
    assert video.evaluate('(m)=>m.paused')
    with page.expect_popup() as popup:
        page.locator('.sample-actions a').first.click()
    sample=popup.value
    sample.wait_for_load_state('load')
    assert sample.locator('h1').inner_text()=='글과 미디어 자료를 한 문서에'
    sample.close()
    with page.expect_download() as download_info:
        page.locator('a[download]').click()
    download=download_info.value
    assert download.suggested_filename.endswith('.adq')
    saved=QA/'downloaded-sample.adq'
    download.save_as(str(saved))
    source=next((ROOT/'docs').glob('*.adq'))
    assert hashlib.sha256(saved.read_bytes()).digest()==hashlib.sha256(source.read_bytes()).digest()
    saved.unlink()

    page.goto(BASE+'support.html',wait_until='networkidle')
    page.locator('#faq-search').fill('비밀번호')
    assert page.locator('.faq-item:visible').count()>0
    assert page.locator('.faq-item:visible').count()<12
    page.locator('#faq-search').fill('no-results-12345')
    assert page.locator('.faq-empty').is_visible()
    page.locator('[data-clear-search]').click()
    assert page.locator('.faq-item:visible').count()==12
    first=page.locator('.faq-item').first
    first.locator('summary').press('Enter')
    assert first.get_attribute('open') is not None
    page.bring_to_front()
    # A deterministic Clipboard API checks what the button writes without depending on OS focus.
    page.evaluate('''()=>{window.__copied=null;Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__copied=value}}})}''')
    page.locator('[data-copy-email]').click()
    page.locator('.toast').wait_for(state='visible')
    assert page.evaluate('window.__copied')==settings['email']
    page.evaluate('''()=>{navigator.clipboard.writeText=async()=>{throw new Error('permission-denied')}}''')
    page.locator('[data-copy-email]').click()
    page.wait_for_function('document.querySelector(".toast").textContent.startsWith("주소를 선택했습니다")')
    assert page.evaluate('window.getSelection().toString()').strip()==settings['email']
    assert page.locator('a.contact-email').get_attribute('href')=='mailto:'+settings['email']

    page.set_viewport_size({'width':390,'height':844})
    page.locator('.menu-toggle').click()
    assert page.locator('.main-nav').is_visible()
    page.keyboard.press('Escape')
    assert page.locator('.menu-toggle').get_attribute('aria-expanded')=='false'
    page.locator('.menu-toggle').click()
    page.locator('.main-nav').get_by_role('link',name='사용 가이드',exact=True).click()
    page.wait_for_url('**/guide.html')
    page.locator('.guide-sidebar a[href="#save"]').click()
    page.wait_for_function('Math.abs(document.getElementById("save").getBoundingClientRect().top-90)<25')
    assert page.locator('.guide-sidebar a[href="#save"]').get_attribute('aria-current')=='location'
    page.goto(BASE+'download.html',wait_until='networkidle')
    if settings['releaseStatus']=='released':
        store=page.locator('a.store-button')
        assert store.get_attribute('href')==settings['storeUrl']
        assert store.get_attribute('target')=='_blank'
        assert store.get_attribute('rel')=='noopener'
        assert settings['releaseVersion'] in page.locator('main').inner_text()
        assert page.locator('time').first.get_attribute('datetime')==settings['releaseDate']
        assert '출시 준비 중' not in page.locator('main').inner_text()
        page.goto(BASE,wait_until='networkidle')
        assert page.locator('.hero-actions [data-store-link]').get_attribute('href')==settings['storeUrl']
        # Check the actual anchor navigation without opening the external Store application.
        context.route('https://apps.microsoft.com/detail/**',lambda route:route.fulfill(status=200,content_type='text/html',body='<title>Store link navigation check</title>'))
        with page.expect_popup() as store_popup:
            page.locator('.hero-actions [data-store-link]').click()
        store_page=store_popup.value
        store_page.wait_for_load_state('load')
        assert store_page.url==settings['storeUrl']
        store_page.close()
        page.goto(BASE+'releases.html',wait_until='networkidle')
        assert settings['releaseVersion'] in page.locator('h2').first.inner_text()
        assert page.locator('time').get_attribute('datetime')==settings['releaseDate']
    else:
        assert page.locator('.store-button').is_disabled()
    page.goto(BASE+'app-privacy.html',wait_until='networkidle')
    assert page.locator('.policy-draft').count()==0
    assert page.locator('meta[name=robots]').count()==0
    assert '2026년 11월 1일' in page.locator('main').inner_text()
    page.goto(BASE+'eula.html',wait_until='networkidle')
    assert page.locator('.policy-draft').count()==1
    assert page.locator('meta[name=robots]').get_attribute('content')=='noindex,follow'
    page.goto(BASE+'support-consent.html',wait_until='networkidle')
    compose=page.locator('[data-consent-mail]')
    assert compose.is_hidden()
    assert not page.locator('#consent-collect').is_checked()
    assert not page.locator('#consent-overseas').is_checked()
    page.locator('#consent-collect').check()
    assert compose.is_hidden()
    page.locator('#consent-overseas').check()
    assert compose.is_visible()
    from urllib.parse import parse_qs,urlparse
    values=parse_qs(urlparse(compose.get_attribute('href')).query)
    assert '국외 이전 별도 동의' in values['body'][0]
    assert '수집·이용 동의' in values['body'][0]
    page.locator('#consent-purpose').select_option('diagnostic')
    assert compose.is_hidden()
    assert not page.locator('#consent-collect').is_checked()
    assert not page.locator('#consent-overseas').is_checked()
    page.locator('#consent-collect').check()
    page.locator('#consent-overseas').check()
    page.locator('#consent-case').fill('invalid-case')
    assert compose.is_hidden()
    page.locator('#consent-case').fill('ADQ-20261101-1234ABCD')
    assert compose.is_visible()
    assert '90일' in page.locator('[data-consent-collection]').inner_text()
    assert 'ADQ-20261101-1234ABCD' in parse_qs(urlparse(compose.get_attribute('href')).query)['body'][0]
    page.locator('#consent-overseas').uncheck()
    assert compose.is_hidden()
    assert compose.get_attribute('href') is None
    # Android policy and platform-specific consent must not inherit Windows dates.
    page.goto(BASE+'android-app-privacy.html',wait_until='networkidle')
    assert page.locator('.policy-draft').count()==0
    assert page.locator('meta[name=robots]').count()==0
    assert '2026년 11월 13일' in page.locator('main').inner_text()
    assert '카메라·마이크' in page.locator('main').inner_text()
    assert page.locator('link[rel=canonical]').get_attribute('href').endswith('/android-app-privacy.html')
    page.goto(BASE+'support-consent.html?platform=android',wait_until='networkidle')
    assert page.locator('#consent-platform').input_value()=='android'
    assert compose.is_hidden()
    assert page.locator('[data-consent-policy]').get_attribute('href')=='android-app-privacy.html'
    page.locator('#consent-collect').check()
    page.locator('#consent-overseas').check()
    body=parse_qs(urlparse(compose.get_attribute('href')).query)['body'][0]
    assert 'Android 1.0 / 시행일 2026-11-13' in body
    assert '/android-app-privacy.html' in body
    page.locator('#consent-platform').select_option('windows')
    assert compose.is_hidden()
    assert compose.get_attribute('href') is None
    assert not page.locator('#consent-collect').is_checked()
    assert not page.locator('#consent-overseas').is_checked()
    assert '2026년 11월 1일' in page.locator('[data-consent-policy-date]').inner_text()
    assert not errors,errors
    browser.close()

(QA/'report.json').write_text(json.dumps({'pages':reports,'tests':['document demo tabs + keyboard','media playback + pause when switching','current sample popup','ADQ download hash matches','FAQ search/reset/keyboard','clipboard email copy','mobile navigation + Escape','guide anchor and active section','Store release state + version/date + direct download navigation','policy draft/final separation','optional support consent'],'consoleErrors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
print(f'PASS: {len(names)} pages at 4 widths, media playback, samples, search, clipboard, mobile navigation, guide anchors. No browser errors.')

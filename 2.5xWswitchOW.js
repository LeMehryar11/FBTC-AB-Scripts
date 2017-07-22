var baseBet = '0.00000001', // Starting bet amount (in BTC)
    betOdds = 2.5, // Bet odds (payout)
    minWait = 500, // Minimum wait time between bets (in milliseconds)
    maxWait = 1000, // Maximum wait time between bets (in milliseconds)
    autobetRunning = true, // Autobet status (true = on / flase = off)
    stopBefore = 3, // Time before redirect to stop autobet (in minutes)
    betHiLo = true, // Determines whether to bet Hi (true) or Lo (false)
    $loButton = $('#double_your_btc_bet_lo_button'),
    $hiButton = $('#double_your_btc_bet_hi_button');

$('#double_your_btc_payout_multiplier').val(betOdds);

function startAutobet(){
    console.log('Turning autobet on...');
    resetBet();
    $loButton.trigger('click');
}

function stopAutobet(){
    console.log('Turning autobet off...');
    autobetRunning = false;
}

function getRandomWait(){
    var waitTime = Math.floor(Math.random() * (maxWait-minWait)) + minWait;
    console.log('Waiting for ' + waitTime + 'ms before next bet...'); 
    return waitTime;
}

function multiplyBet(){
    var currentBet = $('#double_your_btc_stake').val(),
        multipliedBet = (currentBet * 1.666667).toFixed(8);
    $('#double_your_btc_stake').val(multipliedBet);
}

function resetBet(){
    $('#double_your_btc_stake').val(baseBet);
}

function stopBeforeRedirect(){
    var minutesLeft = parseInt($('title').text());
    if(minutesLeft < stopBefore){
        console.log('Approaching redirect. Turning autobet off...');
        stopAutobet();
        return true;
    }
    return false;
}

function clickBet(){
    if(betHiLo){
        $hiButton.trigger('click');
    }
    else{
        $loButton.trigger('click');
    }
}

// Unbinding old stuff:
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();

// On loss:
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event){
    if($(event.currentTarget).is(':contains("lose")')){
        console.log('Bet LOST. Multiplying bet amount...');
        multiplyBet();
        setTimeout(clickBet, getRandomWait());
    }
});

// On win:
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event){
    if($(event.currentTarget).is(':contains("win")')){
        if(stopBeforeRedirect()){
            return;
        }
        console.log('Bet WON. Resetting bet amount...');
        resetBet();
        if(!autobetRunning){
            autobetRunning = true;
            return;
        }
        betHiLo = !betHiLo;
        setTimeout(clickBet, getRandomWait());
    }
});

startAutobet()
